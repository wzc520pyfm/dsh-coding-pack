import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { detectWildcardKeys, parseAllowBuildsSection } from '../shared/allow-builds.ts'
import { versionFromSpecifier } from '../shared/semver.ts'
import type { AllowBuildsState, InstalledPackage, InventorySnapshot } from '../shared/types.ts'
import { profileExists, resolveProfileDir } from './home.ts'

interface ProfileManifest {
  dependencies?: Record<string, string>
  dsh?: { profile?: { bundles?: string[] } }
}

export async function readInventory(profile: string): Promise<InventorySnapshot> {
  const profileDir = resolveProfileDir(profile)
  if (!profileExists(profileDir)) {
    return {
      profile,
      profileDir,
      packages: {},
      starterPackInstalled: false,
      allowBuilds: emptyAllowBuilds(join(profileDir, 'pnpm-workspace.yaml')),
    }
  }
  const manifest = await readJson<ProfileManifest>(join(profileDir, 'package.json')) ?? {}
  const packages: Record<string, InstalledPackage> = {}
  for (const [packageName, specifier] of Object.entries(manifest.dependencies ?? {})) {
    const installedVersion = await readInstalledVersion(profileDir, packageName) ?? versionFromSpecifier(specifier)
    packages[packageName] = {
      packageName,
      version: installedVersion,
      specifier,
      source: installedVersion && installedVersion !== versionFromSpecifier(specifier) ? 'node_modules' : 'dependencies',
    }
  }
  for (const bundle of manifest.dsh?.profile?.bundles ?? []) {
    if (packages[bundle]) continue
    const installedVersion = await readInstalledVersion(profileDir, bundle)
    packages[bundle] = {
      packageName: bundle,
      version: installedVersion,
      specifier: null,
      source: installedVersion ? 'node_modules' : 'bundles',
    }
  }
  return {
    profile,
    profileDir,
    packages,
    starterPackInstalled: Boolean(packages['dsh-starter-pack']),
    allowBuilds: await readAllowBuilds(join(profileDir, 'pnpm-workspace.yaml')),
  }
}

async function readInstalledVersion(profileDir: string, packageName: string): Promise<string | null> {
  const manifest = await readJson<{ version?: string }>(join(profileDir, 'node_modules', ...packageName.split('/'), 'package.json'))
  return typeof manifest?.version === 'string' ? manifest.version : null
}

async function readAllowBuilds(filePath: string): Promise<AllowBuildsState> {
  try {
    const source = await readFile(filePath, 'utf8')
    const entries = parseAllowBuildsSection(source)
    const wildcardKeys = detectWildcardKeys(entries)
    return { filePath, exists: true, entries, hasWildcard: wildcardKeys.length > 0, wildcardKeys }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return emptyAllowBuilds(filePath)
    }
    throw error
  }
}

function emptyAllowBuilds(filePath: string): AllowBuildsState {
  return { filePath, exists: false, entries: {}, hasWildcard: false, wildcardKeys: [] }
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return null
    throw error
  }
}
