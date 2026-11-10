import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { normalizeSettings } from '../shared/policy.ts'
import { SETTINGS_FILE_NAME, type UserSettings } from '../shared/types.ts'
import { resolveProfileDir } from './home.ts'

export async function readUserSettings(profile: string): Promise<UserSettings> {
  const path = settingsPath(profile)
  try {
    const raw = JSON.parse(await readFile(path, 'utf8')) as unknown
    const settings = normalizeSettings(raw && typeof raw === 'object' ? raw as Partial<UserSettings> : {})
    return { ...settings, profile }
  } catch (error) {
    if (isNotFound(error)) return normalizeSettings({ profile })
    throw error
  }
}

export async function writeUserSettings(profile: string, settings: UserSettings): Promise<UserSettings> {
  const normalized = normalizeSettings({ ...settings, profile })
  const path = settingsPath(profile)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
  return normalized
}

export function settingsPath(profile: string): string {
  return join(resolveProfileDir(profile), SETTINGS_FILE_NAME)
}

function isNotFound(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
}
