export const WILDCARD_KEYS = new Set(['*', '"*"', "'*'"])

export function isWildcardKey(key: string): boolean {
  const trimmed = key.trim().replace(/^['"]|['"]$/g, '')
  return trimmed === '*'
}

export function isAllowedValue(value: unknown): boolean {
  return value === true || value === 'true'
}

export function detectWildcardKeys(entries: Readonly<Record<string, unknown>>): string[] {
  return Object.keys(entries).filter(isWildcardKey)
}

export function parseIgnoredBuildKeys(output: string): string[] {
  const keys = new Set<string>()
  const ignored = output.match(/Ignored build scripts:\s*([^\n]+)/i)
  if (ignored?.[1]) {
    for (const part of ignored[1].split(/[,\n]/)) {
      const token = part.trim().replace(/\.$/, '')
      const name = packageNameFromBuildToken(token)
      if (name) keys.add(name)
    }
  }
  for (const match of output.matchAll(/allowBuilds:\s*\n(?:[ \t]+['"]?([@A-Za-z0-9_./:+-]+)['"]?:\s*[^\n]+)/g)) {
    if (match[1] && !isWildcardKey(match[1])) keys.add(packageNameFromBuildToken(match[1]) ?? match[1])
  }
  return [...keys]
}

export function packageNameFromBuildToken(token: string): string | null {
  const trimmed = token.trim().replace(/^['"]|['"]$/g, '')
  if (!trimmed || isWildcardKey(trimmed)) return null
  if (trimmed.startsWith('@')) {
    const scoped = trimmed.match(/^(@[^@/]+\/[^@/]+)(?:@.+)?$/)
    return scoped?.[1] ?? null
  }
  const ordinary = trimmed.match(/^([^@/]+)(?:@.+)?$/)
  return ordinary?.[1] ?? null
}

/**
 * Official documented shape (publish.md / CLI reference):
 *
 * allowBuilds:
 *   dsh-hello-plugin: true
 *
 * Values must be booleans. pnpm may also write placeholder text
 * ("set this to true or false") which is not a decision.
 */
export function parseAllowBuildsSection(source: string): Record<string, unknown> {
  const lines = source.split(/\r?\n/)
  const start = lines.findIndex(line => /^\s*allowBuilds\s*:/.test(line))
  if (start < 0) return {}
  const header = lines[start] ?? ''
  const inline = header.replace(/^\s*allowBuilds\s*:/, '').trim()
  const entries: Record<string, unknown> = {}
  if (inline && inline !== '|' && inline !== '>') {
    Object.assign(entries, parseYamlMapLine(inline) ? { [parseYamlMapLine(inline)!.key]: parseYamlMapLine(inline)!.value } : {})
  }
  const headerIndent = header.match(/^\s*/)?.[0].length ?? 0
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i] ?? ''
    if (line.trim() === '' || /^\s*#/.test(line)) continue
    const indent = line.match(/^\s*/)?.[0].length ?? 0
    if (indent <= headerIndent) break
    const parsed = parseYamlMapLine(line.trim())
    if (parsed) entries[parsed.key] = parsed.value
  }
  return entries
}

function parseYamlMapLine(line: string): { key: string; value: unknown } | null {
  const match = line.match(/^(['"]?)([^:'"]+)\1\s*:\s*(.*?)\s*$/)
  if (!match) return null
  return { key: match[2], value: parseYamlScalar(match[3] ?? '') }
}

function parseYamlScalar(raw: string): unknown {
  const value = raw.trim()
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~' || value === '') return null
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1)
  }
  return value
}

export function upsertAllowBuilds(source: string, keysToAllow: readonly string[]): string {
  const unique = uniqueAllowedKeys(keysToAllow)
  if (unique.length === 0) return source
  const existing = parseAllowBuildsSection(source)
  if (detectWildcardKeys(existing).length > 0) {
    // Never silently change a wildcard policy written by another tool.
    return source
  }
  const missing = unique.filter(key => !isAllowedValue(existing[key]))
  if (missing.length === 0) return source
  if (!/^\s*allowBuilds\s*:/m.test(source)) {
    const body = missing.map(key => `  ${formatYamlKey(key)}: true`).join('\n')
    const prefix = source.endsWith('\n') || source.length === 0 ? source : `${source}\n`
    return `${prefix}allowBuilds:\n${body}\n`
  }
  const lines = source.split(/\r?\n/)
  const start = lines.findIndex(line => /^\s*allowBuilds\s*:/.test(line))
  const headerIndent = lines[start]?.match(/^\s*/)?.[0].length ?? 0
  let end = start + 1
  while (end < lines.length) {
    const line = lines[end] ?? ''
    if (line.trim() !== '' && !/^\s*#/.test(line) && (line.match(/^\s*/)?.[0].length ?? 0) <= headerIndent) break
    end += 1
  }
  const additions = missing.map(key => `${' '.repeat(headerIndent + 2)}${formatYamlKey(key)}: true`)
  return [...lines.slice(0, end), ...additions, ...lines.slice(end)].join('\n')
}

export function uniqueAllowedKeys(keys: readonly string[]): string[] {
  const out: string[] = []
  for (const key of keys) {
    const name = packageNameFromBuildToken(key) ?? key.trim()
    if (!name || isWildcardKey(name)) continue
    if (!out.includes(name)) out.push(name)
  }
  return out
}

export function formatYamlKey(key: string): string {
  return key.startsWith('@') ? `'${key}'` : key
}

export function keysOutsideWhitelist(pending: readonly string[], whitelist: readonly string[]): string[] {
  const allowed = new Set(uniqueAllowedKeys(whitelist))
  return uniqueAllowedKeys(pending).filter(key => !allowed.has(key))
}
