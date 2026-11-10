import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  detectWildcardKeys, isWildcardKey, keysOutsideWhitelist, parseAllowBuildsSection,
  parseIgnoredBuildKeys, uniqueAllowedKeys, upsertAllowBuilds,
} from '../src/shared/allow-builds.ts'

test('never treats or writes a wildcard as an allowed key', () => {
  assert.equal(isWildcardKey('*'), true)
  assert.equal(isWildcardKey('"*"'), true)
  assert.deepEqual(detectWildcardKeys({ '*': true, 'dsh-at-file': true }), ['*'])
  assert.deepEqual(uniqueAllowedKeys(['*', 'dsh-at-file', '*']), ['dsh-at-file'])
  const source = 'packages:\n  - "."\nallowBuilds:\n  "*": true\n'
  const next = upsertAllowBuilds(source, ['dsh-at-file'])
  assert.equal(next, source)
  assert.match(next, /\*/)
})

test('parses the documented allowBuilds boolean map and leaves other keys alone', () => {
  const source = [
    'packages:',
    '  - "."',
    'nodeLinker: hoisted',
    'allowBuilds:',
    '  node-pty: true',
    "  '@scoped/pkg': false",
    '  koffi: set this to true or false',
    'autoInstallPeers: false',
    '',
  ].join('\n')
  const entries = parseAllowBuildsSection(source)
  assert.equal(entries['node-pty'], true)
  assert.equal(entries['@scoped/pkg'], false)
  assert.equal(entries.koffi, 'set this to true or false')
  const next = upsertAllowBuilds(source, ['dsh-at-file', '@omdsh/build-dep'])
  assert.match(next, /node-pty: true/)
  assert.match(next, /koffi: set this to true or false/)
  assert.match(next, /dsh-at-file: true/)
  assert.match(next, /'@omdsh\/build-dep': true/)
  assert.equal(next.includes("'*': true") || next.includes('* : true') || /\n\s+\*: true/.test(next), false)
})

test('appends an allowBuilds section when the file has none, still never writing *', () => {
  const next = upsertAllowBuilds('packages:\n  - "."\n', ['*', 'dsh-open-in-vscode'])
  assert.match(next, /allowBuilds:\n  dsh-open-in-vscode: true\n/)
  assert.equal(/\*/.test(next), false)
})

test('parses ignored build keys and refuses keys outside the confirmed whitelist', () => {
  const pending = parseIgnoredBuildKeys('ERR_PNPM_IGNORED_BUILDS Ignored build scripts: dsh-at-file@0.7.0, evil-dep@1.0.0')
  assert.deepEqual(pending, ['dsh-at-file', 'evil-dep'])
  assert.deepEqual(keysOutsideWhitelist(pending, ['dsh-at-file']), ['evil-dep'])
  assert.deepEqual(keysOutsideWhitelist(pending, ['dsh-at-file', 'evil-dep']), [])
})
