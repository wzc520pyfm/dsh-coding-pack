import {
  allCatalogItems, findCatalogItem, futureSlotIds, targetForPin,
} from './catalog.ts'
import { isAtLeast, isLowerThan, pinForHostLine } from './semver.ts'
import type {
  CatalogItem, ExclusiveChoice, HostLine, HostVersionInfo, InstallRequest,
  InstalledPackage, InventorySnapshot, LocalizedText, PackagePin, PlanItemResult, UserSettings,
} from './types.ts'
import { DEFAULT_PROFILE } from './types.ts'

export interface ResolvedSelection {
  readonly exclusive: Readonly<Record<string, ExclusiveChoice>>
  readonly extras: readonly string[]
  readonly hostLine: HostLine
  readonly nbPluginAcknowledged: boolean
}

export interface PlannedInstall {
  readonly item: CatalogItem
  readonly pin: PackagePin
  readonly target: string
}

const EXCLUSIVE_CLASSES = [
  'session-environment',
  'review-and-changes',
  'context-insights',
  'sidebar-workbench',
  'session-notes',
] as const

export function normalizeSettings(input: Partial<UserSettings> | null | undefined): UserSettings {
  const exclusive: Record<string, ExclusiveChoice> = {}
  for (const classId of EXCLUSIVE_CLASSES) {
    const value = input?.exclusive?.[classId]
    exclusive[classId] = isExclusiveChoice(classId, value) ? value : defaultChoice(classId)
  }
  const extras = unique(asStringArray(input?.extras).filter(id => isExtraItem(id)))
  const hostLineOverride = isHostLine(input?.hostLineOverride) ? input.hostLineOverride : undefined
  return {
    locale: input?.locale === 'zh' ? 'zh' : 'en',
    profile: typeof input?.profile === 'string' && /^[A-Za-z0-9_-]+$/.test(input.profile)
      ? input.profile
      : DEFAULT_PROFILE,
    exclusive,
    extras,
    hostLineOverride,
    nbPluginAcknowledged: input?.nbPluginAcknowledged === true,
  }
}

export function mergeRequest(settings: UserSettings, request: InstallRequest, detectedLine: HostLine): ResolvedSelection {
  const exclusive = { ...settings.exclusive, ...(request.exclusive ?? {}) }
  const normalized = normalizeSettings({
    ...settings,
    exclusive,
    extras: request.extras ?? settings.extras,
    hostLineOverride: request.hostLineOverride ?? settings.hostLineOverride,
    nbPluginAcknowledged: request.nbPluginAcknowledged ?? settings.nbPluginAcknowledged,
  })
  const hostLine = normalized.hostLineOverride && normalized.hostLineOverride !== 'unknown'
    ? normalized.hostLineOverride
    : detectedLine
  return {
    exclusive: normalized.exclusive,
    extras: normalized.extras,
    hostLine,
    nbPluginAcknowledged: normalized.nbPluginAcknowledged === true,
  }
}

export function selectedItems(selection: ResolvedSelection): CatalogItem[] {
  const ids = [
    ...Object.values(selection.exclusive).filter(id => id !== 'skip'),
    ...selection.extras,
  ]
  return unique(ids)
    .map(id => findCatalogItem(id))
    .filter((item): item is CatalogItem => Boolean(item))
}

export function resolvePin(item: CatalogItem, hostLine: HostLine): PackagePin | null {
  if (item.hostPins) return pinForHostLine(hostLine)
  return item.pin ?? null
}

export function planSelection(
  selection: ResolvedSelection,
  inventory: InventorySnapshot,
  host: HostVersionInfo,
): PlanItemResult[] {
  const items = selectedItems(selection)
  const results: PlanItemResult[] = []
  for (const item of items) {
    results.push(planOne(item, selection, inventory, host, items))
  }
  return results
}

function planOne(
  item: CatalogItem,
  selection: ResolvedSelection,
  inventory: InventorySnapshot,
  host: HostVersionInfo,
  selected: readonly CatalogItem[],
): PlanItemResult {
  if (!item.installable || item.role === 'official' || item.role === 'future' || futureSlotIds().includes(item.id)) {
    return blocked(item, 'blocked-future', {
      en: `${item.id} is not an installable item in this pack.`,
      zh: `${item.id} 不是本包的可安装项。`,
    })
  }

  if (item.requiresAck === 'nb-plugin-hide-input' && !selection.nbPluginAcknowledged) {
    return blocked(item, 'blocked-ack', {
      en: 'dsh-nb-plugin hides the composer and the floating button on a fresh install. Acknowledge how to restore them with Cmd+Shift+H / Ctrl+Shift+H or the Settings page before installing.',
      zh: 'dsh-nb-plugin 全新安装会隐藏输入区和悬浮按钮。安装前必须确认可用 Cmd+Shift+H / Ctrl+Shift+H 或设置页恢复。',
    }, item.packageName)
  }

  const missingDep = missingDependency(item, selection, inventory, selected)
  if (missingDep) {
    return blocked(item, 'blocked-dependency', {
      en: `${item.packageName ?? item.id} depends on ${missingDep}, which is not selected or installed.`,
      zh: `${item.packageName ?? item.id} 依赖 ${missingDep}，但该项未选中也未安装。`,
    }, item.packageName)
  }

  const pin = resolvePin(item, selection.hostLine)
  if (!pin) {
    return blocked(item, 'blocked-host-line', {
      en: 'The DSH host version could not be classified, so dsh-better-sidebar was not pinned. Pick the 0.2.2-rc.1+ line or the 0.2.1 line manually. This pack never installs @latest.',
      zh: '无法判定当前 DSH 宿主线，因此未钉定 dsh-better-sidebar。请手动选择 0.2.2-rc.1+ 或 0.2.1 线。本包从不使用 @latest。',
    }, item.packageName)
  }

  const target = targetForPin(pin)
  if (item.packageName === 'dsh-better-sidebar' && /@latest(?:$|[#])/.test(target)) {
    return blocked(item, 'blocked-host-line', {
      en: 'Refusing to install dsh-better-sidebar@latest.',
      zh: '拒绝安装 dsh-better-sidebar@latest。',
    }, item.packageName)
  }

  const conflict = conflictingInstalled(item, inventory)
  if (conflict) {
    return result(item, pin, target, 'blocked-conflict', {
      en: `${conflict.packageName}${conflict.version ? `@${conflict.version}` : ''} is already installed in this class. Uninstall it or choose that alternative before installing ${pin.packageName}.`,
      zh: `同类已安装 ${conflict.packageName}${conflict.version ? `@${conflict.version}` : ''}。请先卸载它或改选该项，再安装 ${pin.packageName}。`,
    })
  }

  const installed = item.packageName ? inventory.packages[item.packageName] : undefined
  if (installed) {
    const installedVersion = installed.version
    const pinnedVersion = pin.version ?? null
    if (installedVersion && pinnedVersion && isAtLeast(installedVersion, pinnedVersion) === true) {
      return result(item, pin, target, 'skip-installed', {
        en: `${pin.packageName}@${installedVersion} is already installed and meets pin ${pinnedVersion}. Skipped.`,
        zh: `${pin.packageName}@${installedVersion} 已安装且不低于钉定版 ${pinnedVersion}，已跳过。`,
      }, installedVersion)
    }
    if (installedVersion && pinnedVersion && isLowerThan(installedVersion, pinnedVersion) === true) {
      return result(item, pin, target, 'blocked-upgrade', {
        en: `${pin.packageName}@${installedVersion} is already installed and is lower than pin ${pinnedVersion}. This pack does not auto-upgrade; choose whether to upgrade.`,
        zh: `${pin.packageName}@${installedVersion} 已安装但低于钉定版 ${pinnedVersion}。本包不自动升级，请自行决定是否升到钉定版。`,
      }, installedVersion)
    }
    return result(item, pin, target, 'blocked-upgrade', {
      en: `${pin.packageName} is already installed (${installedVersion ?? installed.specifier ?? 'version unknown'}) but cannot be compared with pin ${pinnedVersion ?? target}. This pack will not replace it automatically.`,
      zh: `${pin.packageName} 已安装（${installedVersion ?? installed.specifier ?? '版本未知'}），但无法与钉定 ${pinnedVersion ?? target} 比较。本包不会自动替换。`,
    }, installedVersion)
  }

  return result(item, pin, target, 'install', {
    en: `Will run: dsh plugin --profile ${inventory.profile} add ${target}`,
    zh: `将执行：dsh plugin --profile ${inventory.profile} add ${target}`,
  })
}

function missingDependency(
  item: CatalogItem,
  selection: ResolvedSelection,
  inventory: InventorySnapshot,
  selected: readonly CatalogItem[],
): string | null {
  for (const dep of item.dependsOn ?? []) {
    const selectedDep = selected.some(candidate => candidate.id === dep || candidate.packageName === dep)
    const installedDep = Boolean(inventory.packages[dep])
    const exclusivePicksIt = Object.values(selection.exclusive).some((choice) => {
      const chosen = findCatalogItem(choice)
      return chosen?.id === dep || chosen?.packageName === dep
    })
    if (!selectedDep && !installedDep && !exclusivePicksIt) return dep
  }
  return null
}

function conflictingInstalled(item: CatalogItem, inventory: InventorySnapshot): InstalledPackage | null {
  if (!item.exclusiveClass) return null
  const rivals = allCatalogItems().filter(candidate =>
    candidate.exclusiveClass === item.exclusiveClass
    && candidate.id !== item.id
    && candidate.packageName
    && inventory.packages[candidate.packageName],
  )
  const rival = rivals[0]
  if (!rival?.packageName) return null
  if (item.packageName && inventory.packages[item.packageName]) return null
  return inventory.packages[rival.packageName] ?? null
}

export function inventoryWarnings(inventory: InventorySnapshot): LocalizedText[] {
  const warnings: LocalizedText[] = []
  if (inventory.starterPackInstalled) {
    warnings.push({
      en: 'dsh-starter-pack is already installed. It is a generic curated pack, not this workbench installer. The two may both try to install dsh-context or dsh-better-sidebar, and starter-pack may have widened allowBuilds (including a wildcard). This pack will not uninstall it.',
      zh: '检测到已安装 dsh-starter-pack。它是通用精选包，与本工作台安装器定位不同。两者可能重复安装 dsh-context 或 dsh-better-sidebar，且 starter-pack 可能已放宽 allowBuilds（包括通配）。v0.1 不会自动卸载它。',
    })
  }
  if (inventory.allowBuilds.hasWildcard) {
    warnings.push({
      en: `The profile pnpm-workspace.yaml already allows a wildcard build policy (${inventory.allowBuilds.wildcardKeys.join(', ')}). That trusts any later package build script. This pack will not silently change that policy; consider narrowing it to explicit package names.`,
      zh: `档案 pnpm-workspace.yaml 中已有通配 allowBuilds（${inventory.allowBuilds.wildcardKeys.join(', ')}），后续任意包的构建脚本都可能被放行。本包不会暗默改掉该策略；建议收窄为明确的包名白名单。`,
    })
  }
  return warnings
}

function defaultChoice(classId: string): ExclusiveChoice {
  if (classId === 'session-environment') return 'session-rail'
  if (classId === 'review-and-changes') return 'dsh-codex-review-sidebar'
  if (classId === 'context-insights') return 'dsh-context'
  if (classId === 'sidebar-workbench') return 'dsh-better-sidebar'
  if (classId === 'session-notes') return 'dsh-handy'
  return 'skip'
}

function isExclusiveChoice(classId: string, value: unknown): value is ExclusiveChoice {
  if (value === 'skip') return true
  if (typeof value !== 'string') return false
  const item = findCatalogItem(value)
  return Boolean(item && item.exclusiveClass === classId && item.installable)
}

function isExtraItem(id: string): boolean {
  const item = findCatalogItem(id)
  return Boolean(item && item.installable && (item.role === 'optional' || item.role === 'extension'))
}

function isHostLine(value: unknown): value is HostLine {
  return value === 'v022' || value === 'v021' || value === 'unknown'
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)]
}

function blocked(
  item: CatalogItem,
  status: PlanItemResult['status'],
  message: LocalizedText,
  packageName?: string,
): PlanItemResult {
  return {
    itemId: item.id,
    packageName: packageName ?? item.packageName ?? item.id,
    target: '',
    status,
    message,
  }
}

function result(
  item: CatalogItem,
  pin: PackagePin,
  target: string,
  status: PlanItemResult['status'],
  message: LocalizedText,
  installedVersion?: string | null,
): PlanItemResult {
  return {
    itemId: item.id,
    packageName: pin.packageName,
    target,
    status,
    installedVersion,
    pinnedVersion: pin.version ?? null,
    message,
  }
}
