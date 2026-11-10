import assert from 'node:assert/strict'
import { test } from 'node:test'
import { classifyHostLine, compareVersions, extractVersion, isAtLeast, isLowerThan, pinForHostLine, versionFromSpecifier } from '../src/shared/semver.ts'
import { targetForPin } from '../src/shared/catalog.ts'

test('compares prerelease host versions the way the pin table needs', () => {
  assert.equal(compareVersions('0.2.2-rc.1', '0.2.2-rc.0')! > 0, true)
  assert.equal(compareVersions('0.2.2', '0.2.2-rc.1')! > 0, true)
  assert.equal(isAtLeast('0.83.1', '0.83.1'), true)
  assert.equal(isLowerThan('0.28.2', '0.30.1'), true)
  assert.equal(isAtLeast('0.30.1', '0.28.2'), true)
})

test('classifies DSH host lines and refuses to invent a pin for unknown lines', () => {
  assert.equal(classifyHostLine('0.2.2-rc.1'), 'v022')
  assert.equal(classifyHostLine('0.2.2'), 'v022')
  assert.equal(classifyHostLine('0.2.2-rc.12'), 'v022')
  assert.equal(classifyHostLine('0.2.1'), 'v021')
  assert.equal(classifyHostLine('0.2.1-rc.5'), 'v021')
  assert.equal(classifyHostLine('0.2.2-rc.0'), 'unknown')
  assert.equal(classifyHostLine('0.3.0'), 'unknown')
  assert.equal(classifyHostLine('not-a-version'), 'unknown')
  assert.equal(pinForHostLine('v022')?.version, '0.30.1')
  assert.equal(pinForHostLine('v021')?.version, '0.28.2')
  assert.equal(pinForHostLine('unknown'), null)
  assert.equal(targetForPin(pinForHostLine('v022')!), 'dsh-better-sidebar@0.30.1')
  assert.equal(targetForPin(pinForHostLine('v022')!).includes('@latest'), false)
})

test('extracts a version from CLI output and specifiers', () => {
  assert.equal(extractVersion('0.2.2-rc.1'), '0.2.2-rc.1')
  assert.equal(extractVersion('dsh 0.2.1-rc.3'), '0.2.1-rc.3')
  assert.equal(versionFromSpecifier('github:omdsh-dev/dsh-at-file#v0.7.0'), '0.7.0')
  assert.equal(versionFromSpecifier('dsh-handy@0.8.1'), '0.8.1')
})
