import type { HostLine, PackagePin } from './types.ts'
import { BETTER_SIDEBAR_PINS } from './catalog.ts'

export interface ParsedVersion {
  readonly major: number
  readonly minor: number
  readonly patch: number
  readonly prerelease: readonly (string | number)[]
}

const VERSION_RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/

export function parseVersion(input: string | null | undefined): ParsedVersion | null {
  if (!input) return null
  const trimmed = input.trim()
  const match = VERSION_RE.exec(trimmed)
  if (!match) return null
  const prerelease = match[4]
    ? match[4].split('.').map(part => (/^\d+$/.test(part) ? Number(part) : part))
    : []
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease,
  }
}

export function compareVersions(a: string, b: string): number | null {
  const left = parseVersion(a)
  const right = parseVersion(b)
  if (!left || !right) return null
  return compareParsed(left, right)
}

function compareParsed(a: ParsedVersion, b: ParsedVersion): number {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0
  if (a.prerelease.length === 0) return 1
  if (b.prerelease.length === 0) return -1
  const len = Math.max(a.prerelease.length, b.prerelease.length)
  for (let i = 0; i < len; i += 1) {
    const l = a.prerelease[i]
    const r = b.prerelease[i]
    if (l === undefined) return -1
    if (r === undefined) return 1
    if (l === r) continue
    const lNum = typeof l === 'number'
    const rNum = typeof r === 'number'
    if (lNum && rNum) return l < r ? -1 : 1
    if (lNum) return -1
    if (rNum) return 1
    return String(l) < String(r) ? -1 : 1
  }
  return 0
}

export function isAtLeast(installed: string, pin: string): boolean | null {
  const cmp = compareVersions(installed, pin)
  if (cmp === null) return null
  return cmp >= 0
}

export function isLowerThan(installed: string, pin: string): boolean | null {
  const cmp = compareVersions(installed, pin)
  if (cmp === null) return null
  return cmp < 0
}

const V022_FLOOR = parseVersion('0.2.2-rc.1')!
const V023_FLOOR = parseVersion('0.3.0')!

export function classifyHostLine(version: string | null | undefined): HostLine {
  const parsed = parseVersion(extractVersion(version ?? ''))
  if (!parsed) return 'unknown'
  if (parsed.major === 0 && parsed.minor === 2 && parsed.patch === 1) return 'v021'
  if (compareParsed(parsed, V022_FLOOR) >= 0 && compareParsed(parsed, V023_FLOOR) < 0) return 'v022'
  return 'unknown'
}

export function extractVersion(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const candidates = [
    trimmed,
    ...trimmed.split(/[\s/,]+/),
  ]
  const explicit = trimmed.match(/v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/)
  if (explicit?.[0]) candidates.unshift(explicit[0])
  for (const candidate of candidates) {
    const parsed = parseVersion(candidate)
    if (parsed) return formatParsed(parsed, candidate)
  }
  return null
}

function formatParsed(parsed: ParsedVersion, original: string): string {
  const match = VERSION_RE.exec(original.trim())
  if (match) return original.trim().replace(/^v/, '')
  const pre = parsed.prerelease.length ? `-${parsed.prerelease.join('.')}` : ''
  return `${parsed.major}.${parsed.minor}.${parsed.patch}${pre}`
}

export function pinForHostLine(line: HostLine): PackagePin | null {
  if (line === 'v022') return BETTER_SIDEBAR_PINS.v022
  if (line === 'v021') return BETTER_SIDEBAR_PINS.v021
  return null
}

export function versionFromSpecifier(specifier: string | null | undefined): string | null {
  if (!specifier) return null
  const hash = specifier.match(/#v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/)
  if (hash?.[1]) return hash[1]
  const at = specifier.match(/@v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/)
  if (at?.[1]) return at[1]
  return parseVersion(specifier) ? specifier.replace(/^v/, '') : null
}
