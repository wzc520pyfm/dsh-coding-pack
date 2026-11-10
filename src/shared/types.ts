export const PLUGIN_ID = 'dsh-coding-workbench-pack'
export const PLUGIN_DISPLAY_EN = 'Coding Workbench Pack'
export const PLUGIN_DISPLAY_ZH = '编程工作台开箱包'
export const API_PREFIX = '/api/dsh-coding-workbench-pack'
export const COMMAND_NAME = 'coding-workbench'
export const DEFAULT_PROFILE = 'web'
export const SETTINGS_SECTION_ID = 'coding-workbench'
export const SETTINGS_FILE_NAME = 'dsh-coding-workbench-pack.settings.json'

export type UiLocale = 'en' | 'zh'
export type HostLine = 'v022' | 'v021' | 'unknown'
export type ExclusiveChoice = string | 'skip'
export type CatalogRole = 'official' | 'default' | 'alternative' | 'optional' | 'extension' | 'future'

export type CategoryId =
  | 'session-environment'
  | 'review-and-changes'
  | 'context-insights'
  | 'sidebar-workbench'
  | 'session-notes'
  | 'session-notes-extensions'
  | 'ui-visibility'
  | 'file-reference-and-editor'

export interface LocalizedText {
  readonly en: string
  readonly zh: string
}

export interface PackagePin {
  readonly kind: 'npm' | 'github'
  readonly packageName: string
  readonly version?: string
  readonly github?: { readonly owner: string; readonly repo: string; readonly tag: string }
}

export interface BetterSidebarPins {
  readonly v022: PackagePin
  readonly v021: PackagePin
}

export interface CatalogItem {
  readonly id: string
  readonly role: CatalogRole
  readonly categoryId: CategoryId | 'future'
  readonly exclusiveClass?: string
  readonly packageName?: string
  readonly repository?: string
  readonly pin?: PackagePin
  readonly hostPins?: BetterSidebarPins
  readonly license?: string
  readonly dependsOn?: readonly string[]
  readonly requiresAck?: 'nb-plugin-hide-input'
  readonly name: LocalizedText
  readonly summary: LocalizedText
  readonly official?: boolean
  readonly installable: boolean
  readonly defaultSelected?: boolean
}

export interface CatalogCategory {
  readonly id: CategoryId
  readonly exclusive: boolean
  readonly defaultItemId?: string
  readonly skippable: boolean
  readonly title: LocalizedText
  readonly blurb: LocalizedText
  readonly items: readonly CatalogItem[]
}

export interface FutureSlot {
  readonly id: string
  readonly suggestedName: string
  readonly name: LocalizedText
  readonly summary: LocalizedText
  readonly categoryHint: LocalizedText
}

export interface UserSettings {
  readonly locale: UiLocale
  readonly profile: string
  readonly exclusive: Readonly<Record<string, ExclusiveChoice>>
  readonly extras: readonly string[]
  readonly hostLineOverride?: HostLine
  readonly nbPluginAcknowledged?: boolean
}

export interface InstalledPackage {
  readonly packageName: string
  readonly version: string | null
  readonly specifier: string | null
  readonly source: 'dependencies' | 'bundles' | 'node_modules'
}

export interface InventorySnapshot {
  readonly profile: string
  readonly profileDir: string | null
  readonly packages: Readonly<Record<string, InstalledPackage>>
  readonly starterPackInstalled: boolean
  readonly allowBuilds: AllowBuildsState
}

export interface AllowBuildsState {
  readonly filePath: string | null
  readonly exists: boolean
  readonly entries: Readonly<Record<string, unknown>>
  readonly hasWildcard: boolean
  readonly wildcardKeys: readonly string[]
}

export interface HostVersionInfo {
  readonly raw: string | null
  readonly parsed: string | null
  readonly line: HostLine
  readonly source: 'dsh-version' | 'manual' | 'unavailable'
}

export interface PlanItemResult {
  readonly itemId: string
  readonly packageName: string
  readonly target: string
  readonly status:
    | 'install'
    | 'skip-installed'
    | 'blocked-conflict'
    | 'blocked-dependency'
    | 'blocked-upgrade'
    | 'blocked-host-line'
    | 'blocked-ack'
    | 'blocked-future'
    | 'blocked-not-installable'
    | 'blocked-build'
    | 'needs-allow-builds'
  readonly installedVersion?: string | null
  readonly pinnedVersion?: string | null
  readonly message: LocalizedText
}

export interface InstallRequest {
  readonly exclusive?: Readonly<Record<string, ExclusiveChoice>>
  readonly extras?: readonly string[]
  readonly hostLineOverride?: HostLine
  readonly nbPluginAcknowledged?: boolean
  readonly locale?: UiLocale
  readonly confirmAllowBuilds?: readonly string[]
  readonly retryItemId?: string
}

export interface InstallItemOutcome {
  readonly itemId: string
  readonly packageName: string
  readonly target: string
  readonly status: 'installed' | 'skipped' | 'blocked' | 'failed' | 'needs-allow-builds'
  readonly installedVersion?: string | null
  readonly pinnedVersion?: string | null
  readonly message: LocalizedText
  readonly pendingBuilds?: readonly string[]
  readonly log?: string
}

export interface InstallResponse {
  readonly ok: boolean
  readonly host: HostVersionInfo
  readonly inventoryWarnings: readonly LocalizedText[]
  readonly outcomes: readonly InstallItemOutcome[]
  readonly restartRecommended: boolean
  readonly pendingAllowBuilds?: {
    readonly itemId: string
    readonly packageName: string
    readonly keys: readonly string[]
    readonly message: LocalizedText
  }
}

export interface StatusResponse {
  readonly settings: UserSettings
  readonly host: HostVersionInfo
  readonly inventory: InventorySnapshot
  readonly plan: readonly PlanItemResult[]
  readonly inventoryWarnings: readonly LocalizedText[]
}
