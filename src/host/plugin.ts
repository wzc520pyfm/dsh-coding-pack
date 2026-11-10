import { CATEGORIES, FUTURE_SLOTS, PINNED_AS_OF, defaultExclusiveSelections } from '../shared/catalog.ts'
import { inventoryWarnings, mergeRequest, planSelection } from '../shared/policy.ts'
import { API_PREFIX, COMMAND_NAME, PLUGIN_ID, type HostLine, type InstallRequest, type InstallResponse, type StatusResponse, type UserSettings } from '../shared/types.ts'
import { applyConfirmedAllowBuilds, outcomeFromCommand, outcomeFromPlan, runPluginAdd } from './install.ts'
import { header, HttpError, isSameOrigin, readJsonBody, sendError, sendJson, type RequestLike, type ResponseLike } from './http.ts'
import { inferProfileName } from './home.ts'
import { readInventory } from './inventory.ts'
import { readUserSettings, writeUserSettings } from './settings-store.ts'
import { readHostVersion } from './version.ts'

export const name = PLUGIN_ID
export const inject = ['webServer', 'commands']

interface HostContext {
  effect?(callback: () => void | (() => void), label?: string): void
  webServer?: { register(route: { kind: string; path: string; handler: (req: RequestLike, res: ResponseLike) => Promise<void> | void }): () => void }
  commands?: {
    register(definition: {
      name: string
      description: string
      input?: { hint?: string }
      handler: (invocation: { rawInput?: string }) => { kind: 'success' | 'error'; text: string } | Promise<{ kind: 'success' | 'error'; text: string }>
    }): () => void
  }
}

export function apply(ctx: HostContext): void {
  const registerRoutes = () => {
    if (!ctx.webServer?.register) return () => undefined
    return ctx.webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler: (req, res) => route(req, res),
    })
  }
  const registerCommand = () => {
    if (!ctx.commands?.register) return () => undefined
    return ctx.commands.register({
      name: COMMAND_NAME,
      description: 'Inspect or install the Coding Workbench Pack catalog',
      input: { hint: '[status|install|defaults]' },
      handler: async ({ rawInput }) => runCommand(rawInput ?? ''),
    })
  }
  if (ctx.effect) {
    ctx.effect(registerRoutes, 'dsh-coding-pack: routes')
    ctx.effect(registerCommand, 'dsh-coding-pack: command')
  } else {
    registerRoutes()
    registerCommand()
  }
}

async function route(req: RequestLike, res: ResponseLike): Promise<void> {
  if (!isSameOrigin(req.headers)) { sendError(res, 403, 'cross_origin', 'Cross-origin requests are refused'); return }
  if (String(req.method ?? '').toUpperCase() !== 'POST') { sendError(res, 405, 'method_not_allowed', 'Only POST is supported'); return }
  if (!/^application\/json(?:\s*;|$)/i.test(header(req.headers, 'content-type'))) {
    sendError(res, 415, 'json_required', 'Content-Type must be application/json')
    return
  }
  try {
    const url = new URL(req.url ?? '/', 'http://dsh.local')
    const body = await readJsonBody(req as unknown as NodeJS.ReadableStream)
    const profile = inferProfileName()
    if (url.pathname === `${API_PREFIX}/catalog`) {
      sendJson(res, 200, { ok: true, data: { categories: CATEGORIES, futureSlots: FUTURE_SLOTS, pinnedAsOf: PINNED_AS_OF } })
      return
    }
    if (url.pathname === `${API_PREFIX}/status`) {
      sendJson(res, 200, { ok: true, data: await loadStatus(profile) })
      return
    }
    if (url.pathname === `${API_PREFIX}/settings`) {
      const current = await readUserSettings(profile)
      const saved = await writeUserSettings(profile, { ...current, ...parseSettingsPatch(body) })
      sendJson(res, 200, { ok: true, data: saved })
      return
    }
    if (url.pathname === `${API_PREFIX}/install`) {
      sendJson(res, 200, { ok: true, data: await install(profile, body as InstallRequest) })
      return
    }
    sendError(res, 404, 'route_not_found', 'Route was not found')
  } catch (error) {
    if (error instanceof HttpError) { sendError(res, error.status, error.code, error.message); return }
    sendError(res, 500, 'host_failed', error instanceof Error ? error.message : 'The host request failed')
  }
}

async function loadStatus(profile: string): Promise<StatusResponse> {
  const settings = await readUserSettings(profile)
  const inventory = await readInventory(profile)
  const detected = await readHostVersion()
  const host = settings.hostLineOverride && settings.hostLineOverride !== 'unknown'
    ? { ...detected, line: settings.hostLineOverride, source: 'manual' as const }
    : detected
  const selection = mergeRequest(settings, {}, host.line)
  return {
    settings,
    host,
    inventory,
    plan: planSelection(selection, inventory, host),
    inventoryWarnings: inventoryWarnings(inventory),
  }
}

async function install(profile: string, request: InstallRequest): Promise<InstallResponse> {
  const current = await readUserSettings(profile)
  const settings = await writeUserSettings(profile, {
    ...current,
    exclusive: request.exclusive ?? current.exclusive,
    extras: request.extras ?? current.extras,
    hostLineOverride: request.hostLineOverride ?? current.hostLineOverride,
    nbPluginAcknowledged: request.nbPluginAcknowledged ?? current.nbPluginAcknowledged,
    locale: request.locale ?? current.locale,
  })
  const inventory = await readInventory(profile)
  const detected = await readHostVersion(settings.hostLineOverride)
  const host = detected
  const selection = mergeRequest(settings, request, host.line)
  const plan = planSelection(selection, inventory, host)
  const warnings = inventoryWarnings(inventory)
  const outcomes = []
  let restartRecommended = false
  let pendingAllowBuilds: InstallResponse['pendingAllowBuilds']

  const retry = request.retryItemId ? plan.find(item => item.itemId === request.retryItemId) : undefined
  const work = retry ? [retry] : plan

  for (const item of work) {
    if (item.status !== 'install') {
      const blocked = outcomeFromPlan(item)
      if (blocked) outcomes.push(blocked)
      continue
    }
    if (request.confirmAllowBuilds && request.retryItemId === item.itemId) {
      const applied = await applyConfirmedAllowBuilds(
        inventory.allowBuilds.filePath,
        request.confirmAllowBuilds,
        request.confirmAllowBuilds,
      )
      if (!applied.ok) {
        outcomes.push({
          itemId: item.itemId,
          packageName: item.packageName,
          target: item.target,
          status: 'blocked' as const,
          pinnedVersion: item.pinnedVersion,
          message: applied.message,
        })
        continue
      }
    }
    const result = await runPluginAdd(profile, item.target)
    const outcome = outcomeFromCommand(item, profile, result)
    outcomes.push(outcome)
    if (outcome.status === 'installed') restartRecommended = true
    if (outcome.status === 'needs-allow-builds') {
      pendingAllowBuilds = {
        itemId: item.itemId,
        packageName: item.packageName,
        keys: outcome.pendingBuilds ?? [],
        message: outcome.message,
      }
      break
    }
  }

  return {
    ok: outcomes.every(item => item.status === 'installed' || item.status === 'skipped'),
    host,
    inventoryWarnings: warnings,
    outcomes,
    restartRecommended,
    pendingAllowBuilds,
  }
}

async function runCommand(rawInput: string): Promise<{ kind: 'success' | 'error'; text: string }> {
  const profile = inferProfileName()
  const token = rawInput.trim().split(/\s+/)[0]?.toLowerCase() || 'status'
  try {
    if (token === 'status' || token === 'list' || token === '') {
      const status = await loadStatus(profile)
      return { kind: 'success', text: renderStatus(status) }
    }
    if (token === 'defaults' || token === 'install') {
      const request: InstallRequest = token === 'defaults'
        ? { exclusive: defaultExclusiveSelections(), extras: [], nbPluginAcknowledged: false }
        : {}
      const result = await install(profile, request)
      return { kind: result.ok ? 'success' : 'error', text: renderInstall(result) }
    }
    return {
      kind: 'error',
      text: 'Usage: /coding-workbench [status|install|defaults]\nstatus — catalog and install plan\ninstall — install the current selection\ndefaults — install the v0.1 default set (no optionals)',
    }
  } catch (error) {
    return { kind: 'error', text: error instanceof Error ? error.message : 'The command failed' }
  }
}

function renderStatus(status: StatusResponse): string {
  const lines = [
    'Coding Workbench Pack / 编程工作台开箱包',
    `Host: ${status.host.parsed ?? status.host.raw ?? 'unavailable'} (${status.host.line}, ${status.host.source})`,
    `Profile: ${status.settings.profile}`,
    ...status.inventoryWarnings.map(warning => `Warning: ${warning.en}`),
    '',
    'Plan:',
    ...status.plan.map(item => `- ${item.itemId}: ${item.status}${item.target ? ` → ${item.target}` : ''} — ${item.message.en}`),
    '',
    'Future slots (undelivered, not installable): dsh-suggest-card, dsh-worktrunk, dsh-new-workspace, dsh-composer-branch (name not finalized).',
    'Use /coding-workbench install to apply the current selection, or the Settings page for grouped choices.',
  ]
  return lines.join('\n')
}

function renderInstall(result: InstallResponse): string {
  const lines = [
    ...result.inventoryWarnings.map(warning => `Warning: ${warning.en}`),
    ...result.outcomes.map(item => `- ${item.itemId}: ${item.status}${item.target ? ` → ${item.target}` : ''} — ${item.message.en}`),
  ]
  if (result.pendingAllowBuilds) {
    lines.push(`Build scripts were blocked for ${result.pendingAllowBuilds.packageName}. Confirm a package whitelist in Settings before retrying. Keys: ${result.pendingAllowBuilds.keys.join(', ') || '(see log)'}. This pack will not write allowBuilds '*'.`)
  }
  if (result.restartRecommended) {
    lines.push('Restart dsh web (or hard-refresh the UI) once so newly installed bundles can load.')
  }
  return lines.join('\n')
}

function parseSettingsPatch(body: Record<string, unknown>): Partial<UserSettings> {
  const patch: {
    locale?: UserSettings['locale']
    exclusive?: UserSettings['exclusive']
    extras?: UserSettings['extras']
    hostLineOverride?: HostLine
    nbPluginAcknowledged?: boolean
  } = {}
  if (body.locale === 'en' || body.locale === 'zh') patch.locale = body.locale
  if (body.exclusive && typeof body.exclusive === 'object' && !Array.isArray(body.exclusive)) {
    patch.exclusive = body.exclusive as UserSettings['exclusive']
  }
  if (Array.isArray(body.extras)) patch.extras = body.extras.filter((item): item is string => typeof item === 'string')
  if (body.hostLineOverride === 'v022' || body.hostLineOverride === 'v021' || body.hostLineOverride === 'unknown') {
    patch.hostLineOverride = body.hostLineOverride
  }
  if (typeof body.nbPluginAcknowledged === 'boolean') patch.nbPluginAcknowledged = body.nbPluginAcknowledged
  return patch
}
