import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { DEFAULT_PROFILE } from '../shared/types.ts'

export function resolveDshHome(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.DSH_HOME?.trim()
  if (override) return resolve(expandHome(override))
  return join(homedir(), '.dsh')
}

export function resolveProfileDir(profile: string, env: NodeJS.ProcessEnv = process.env): string {
  return join(resolveDshHome(env), 'profiles', profile)
}

export function inferProfileName(argv: readonly string[] = process.argv, env: NodeJS.ProcessEnv = process.env): string {
  const flag = argv.findIndex(arg => arg === '--profile')
  if (flag >= 0) {
    const value = argv[flag + 1]
    if (value && /^[A-Za-z0-9_-]+$/.test(value)) return value
  }
  const envName = env.DSH_PROFILE?.trim()
  if (envName && /^[A-Za-z0-9_-]+$/.test(envName)) return envName
  if (argv.includes('web')) return 'web'
  return DEFAULT_PROFILE
}

export function profileExists(profileDir: string): boolean {
  return existsSync(join(profileDir, 'package.json'))
}

function expandHome(path: string): string {
  if (path === '~') return homedir()
  if (path.startsWith('~/')) return join(homedir(), path.slice(2))
  return path
}
