import { readFile, writeFile } from 'node:fs/promises'
import { keysOutsideWhitelist, upsertAllowBuilds } from '../shared/allow-builds.ts'
import { detectWildcardKeys, parseAllowBuildsSection } from '../shared/allow-builds.ts'

export async function confirmAllowBuilds(
  filePath: string,
  pendingKeys: readonly string[],
  confirmedKeys: readonly string[],
): Promise<{ wrote: boolean; refused: readonly string[]; hasWildcard: boolean }> {
  const refused = keysOutsideWhitelist(pendingKeys, confirmedKeys)
  if (refused.length > 0) return { wrote: false, refused, hasWildcard: false }
  let source = ''
  try {
    source = await readFile(filePath, 'utf8')
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) throw error
  }
  const existing = parseAllowBuildsSection(source)
  const hasWildcard = detectWildcardKeys(existing).length > 0
  if (hasWildcard) return { wrote: false, refused: [], hasWildcard: true }
  const next = upsertAllowBuilds(source, confirmedKeys)
  if (next === source) return { wrote: false, refused: [], hasWildcard: false }
  await writeFile(filePath, next.endsWith('\n') ? next : `${next}\n`, 'utf8')
  return { wrote: true, refused: [], hasWildcard: false }
}
