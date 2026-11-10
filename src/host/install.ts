import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import { parseIgnoredBuildKeys, uniqueAllowedKeys } from '../shared/allow-builds.ts'
import type { InstallItemOutcome, LocalizedText, PlanItemResult } from '../shared/types.ts'
import { confirmAllowBuilds } from './allow-builds-file.ts'
import { assertSafeTarget, resolveDshCommand } from './dsh-command.ts'

const INSTALL_TIMEOUT_MS = 5 * 60 * 1000

export interface CommandResult {
  readonly exitCode: number | null
  readonly timedOut: boolean
  readonly stdout: string
  readonly stderr: string
}

export async function runPluginAdd(profile: string, target: string): Promise<CommandResult> {
  assertSafeTarget(target)
  return runPlugin(profile, ['add', '-w', target])
}

export function pluginAddCommand(profile: string, target: string): string {
  return `dsh plugin --profile ${profile} add ${target}`
}

export function runPlugin(profile: string, pluginArgs: string[]): Promise<CommandResult> {
  const command = resolveDshCommand()
  return new Promise((resolvePromise) => {
    const child = spawn(command.file, [...command.args, 'plugin', '--profile', profile, ...pluginArgs], {
      cwd: command.cwd,
      env: { ...process.env, CI: 'true' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: command.viaShell,
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      killChild(child)
    }, INSTALL_TIMEOUT_MS)
    child.stdout.on('data', (chunk: Buffer) => { stdout = (stdout + chunk.toString()).slice(-256 * 1024) })
    child.stderr.on('data', (chunk: Buffer) => { stderr = (stderr + chunk.toString()).slice(-64 * 1024) })
    child.on('error', (error) => {
      clearTimeout(timer)
      resolvePromise({ exitCode: 127, timedOut: false, stdout, stderr: `${stderr}\n${error.message}` })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      resolvePromise({ exitCode: code, timedOut, stdout, stderr })
    })
  })
}

export function outcomeFromPlan(plan: PlanItemResult): InstallItemOutcome | null {
  if (plan.status === 'install') return null
  const status = plan.status === 'skip-installed' ? 'skipped' : 'blocked'
  return {
    itemId: plan.itemId,
    packageName: plan.packageName,
    target: plan.target,
    status,
    installedVersion: plan.installedVersion,
    pinnedVersion: plan.pinnedVersion,
    message: plan.message,
  }
}

export function outcomeFromCommand(
  plan: PlanItemResult,
  profile: string,
  result: CommandResult,
): InstallItemOutcome {
  const log = trimLog(`${result.stdout}\n${result.stderr}`)
  const pending = uniqueAllowedKeys(parseIgnoredBuildKeys(`${result.stdout}\n${result.stderr}`))
  if (result.timedOut) {
    return fail(plan, {
      en: `${pluginAddCommand(profile, plan.target)} timed out.`,
      zh: `${pluginAddCommand(profile, plan.target)} 超时。`,
    }, log)
  }
  if (pending.length > 0 || /ERR_PNPM_IGNORED_BUILDS/.test(log)) {
    return {
      itemId: plan.itemId,
      packageName: plan.packageName,
      target: plan.target,
      status: 'needs-allow-builds',
      pinnedVersion: plan.pinnedVersion,
      pendingBuilds: pending,
      log,
      message: {
        en: `A build script was blocked for ${plan.target}. Confirm a package-name whitelist (this plugin and its verified direct build dependencies only). This pack will not write allowBuilds '*' or approve anything outside that list.`,
        zh: `${plan.target} 的构建脚本被拦截。请确认仅包含该插件及其已核实直接构建依赖的包名白名单。本包不会写入 allowBuilds '*'，也不会放行名单外的脚本。`,
      },
    }
  }
  if ((result.exitCode ?? 1) !== 0) {
    return fail(plan, {
      en: `${pluginAddCommand(profile, plan.target)} failed (exit ${result.exitCode ?? 'null'}).`,
      zh: `${pluginAddCommand(profile, plan.target)} 失败（退出码 ${result.exitCode ?? 'null'}）。`,
    }, log)
  }
  return {
    itemId: plan.itemId,
    packageName: plan.packageName,
    target: plan.target,
    status: 'installed',
    pinnedVersion: plan.pinnedVersion,
    log,
    message: {
      en: `Installed ${plan.target}.`,
      zh: `已安装 ${plan.target}。`,
    },
  }
}

export async function applyConfirmedAllowBuilds(
  workspaceFile: string | null,
  pending: readonly string[],
  confirmed: readonly string[],
): Promise<{ ok: boolean; message: LocalizedText }> {
  if (!workspaceFile) {
    return {
      ok: false,
      message: {
        en: 'The profile pnpm-workspace.yaml path is unknown, so allowBuilds was not changed.',
        zh: '无法定位档案的 pnpm-workspace.yaml，未改写 allowBuilds。',
      },
    }
  }
  const result = await confirmAllowBuilds(workspaceFile, pending, confirmed)
  if (result.hasWildcard) {
    return {
      ok: false,
      message: {
        en: 'The profile already has a wildcard allowBuilds policy. This pack will not add keys or change that policy. Narrow it manually if you intend to install a git package that needs a build.',
        zh: '档案已有通配 allowBuilds 策略。本包不会追加键或改写该策略。若仍要安装需要构建的 git 包，请自行收窄后再试。',
      },
    }
  }
  if (result.refused.length > 0) {
    return {
      ok: false,
      message: {
        en: `Refused to allow build scripts outside the confirmed whitelist: ${result.refused.join(', ')}.`,
        zh: `拒绝放行白名单之外的构建脚本：${result.refused.join(', ')}。`,
      },
    }
  }
  return {
    ok: true,
    message: {
      en: result.wrote
        ? `Wrote explicit allowBuilds keys: ${uniqueAllowedKeys(confirmed).join(', ')}.`
        : 'allowBuilds already contained the confirmed keys.',
      zh: result.wrote
        ? `已写入明确的 allowBuilds 键：${uniqueAllowedKeys(confirmed).join(', ')}。`
        : 'allowBuilds 中已有确认的键。',
    },
  }
}

function fail(plan: PlanItemResult, message: LocalizedText, log: string): InstallItemOutcome {
  return {
    itemId: plan.itemId,
    packageName: plan.packageName,
    target: plan.target,
    status: 'failed',
    pinnedVersion: plan.pinnedVersion,
    log,
    message,
  }
}

function killChild(child: ChildProcess): void {
  if (process.platform === 'win32' && child.pid !== undefined) {
    try { spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' }) }
    catch { child.kill('SIGKILL') }
    return
  }
  child.kill('SIGKILL')
}

function trimLog(text: string): string {
  return text.trim().slice(-16_000)
}
