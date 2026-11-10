import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BETTER_SIDEBAR_PINS, CATEGORIES, FUTURE_SLOTS, NEVER_LATEST_PACKAGES, PINNED_AS_OF,
  allCatalogItems, defaultExclusiveSelections, defaultSettingsExtras, findCatalogItem,
  futureSlotIds, installableItems, targetForPin,
} from '../src/shared/catalog.ts'

test('package and display names do not use Codex', () => {
  assert.equal(PINNED_AS_OF.includes('2026-11-10'), true)
  for (const item of installableItems()) {
    if (item.id === 'dsh-codex-review-sidebar') continue
    assert.equal(/codex/i.test(item.id), false)
  }
})

test('pins match the confirmed v0.1 range page', () => {
  assert.deepEqual(findCatalogItem('session-rail')?.pin, { kind: 'npm', packageName: 'session-rail', version: '0.1.3' })
  assert.deepEqual(findCatalogItem('dsh-session-rail')?.pin, { kind: 'npm', packageName: 'dsh-session-rail', version: '0.1.16' })
  assert.deepEqual(findCatalogItem('dsh-codex-review-sidebar')?.pin, { kind: 'npm', packageName: 'dsh-codex-review-sidebar', version: '0.2.0' })
  assert.deepEqual(findCatalogItem('dsh-git-review')?.pin, { kind: 'npm', packageName: 'dsh-git-review', version: '0.1.8' })
  assert.deepEqual(findCatalogItem('dsh-review-threads')?.pin, { kind: 'npm', packageName: 'dsh-review-threads', version: '0.1.0' })
  assert.deepEqual(findCatalogItem('dsh-context')?.pin, { kind: 'npm', packageName: 'dsh-context', version: '0.83.1' })
  assert.deepEqual(findCatalogItem('dsh-handy')?.pin, { kind: 'npm', packageName: 'dsh-handy', version: '0.8.1' })
  assert.deepEqual(findCatalogItem('dsh-session-notebook')?.pin, { kind: 'npm', packageName: '@timestatic/dsh-session-notebook', version: '0.2.0' })
  assert.deepEqual(findCatalogItem('dsh-better-sidebar-jupyter')?.pin, { kind: 'npm', packageName: '@dong-victor/dsh-better-sidebar-jupyter', version: '0.2.6' })
  assert.deepEqual(findCatalogItem('dsh-flowglass')?.pin, { kind: 'npm', packageName: 'dsh-flowglass', version: '0.7.4' })
  assert.deepEqual(findCatalogItem('dsh-nb-plugin')?.pin, { kind: 'npm', packageName: 'dsh-nb-plugin', version: '1.4.0' })
  assert.equal(targetForPin(findCatalogItem('dsh-at-file')!.pin!), 'github:omdsh-dev/dsh-at-file#v0.7.0')
  assert.equal(targetForPin(findCatalogItem('dsh-open-in-vscode')!.pin!), 'github:omdsh-dev/dsh-open-in-vscode#v0.1.6')
  assert.deepEqual(BETTER_SIDEBAR_PINS.v022, { kind: 'npm', packageName: 'dsh-better-sidebar', version: '0.30.1' })
  assert.deepEqual(BETTER_SIDEBAR_PINS.v021, { kind: 'npm', packageName: 'dsh-better-sidebar', version: '0.28.2' })
  assert.deepEqual([...NEVER_LATEST_PACKAGES], ['dsh-better-sidebar'])
})

test('defaults select the locked workbench set and no optionals', () => {
  const exclusive = defaultExclusiveSelections()
  assert.deepEqual(exclusive, {
    'session-environment': 'session-rail',
    'review-and-changes': 'dsh-codex-review-sidebar',
    'context-insights': 'dsh-context',
    'sidebar-workbench': 'dsh-better-sidebar',
    'session-notes': 'dsh-handy',
  })
  assert.deepEqual(defaultSettingsExtras(), [])
  assert.equal(findCatalogItem('dsh-nb-plugin')?.defaultSelected, undefined)
  assert.equal(findCatalogItem('dsh-at-file')?.defaultSelected, undefined)
  assert.equal(findCatalogItem('dsh-flowglass')?.defaultSelected, undefined)
})

test('official items and future slots are not installable and are not mixed into installable lists', () => {
  const official = allCatalogItems().filter(item => item.role === 'official')
  assert.ok(official.length >= 4)
  for (const item of official) assert.equal(item.installable, false)
  const installableIds = new Set(installableItems().map(item => item.id))
  for (const slot of FUTURE_SLOTS) {
    assert.equal(installableIds.has(slot.id), false)
    assert.ok(futureSlotIds().includes(slot.id) || slot.id === 'composer-branch')
  }
  assert.deepEqual([...futureSlotIds()], ['dsh-suggest-card', 'dsh-worktrunk', 'dsh-new-workspace', 'composer-branch'])
  assert.equal(findCatalogItem('dsh-suggest-card'), undefined)
  assert.equal(CATEGORIES.some(category => category.items.some(item => futureSlotIds().includes(item.id))), false)
})

test('category names are workbench-specific, not starter-pack generic groups', () => {
  const ids = CATEGORIES.map(category => category.id).join(' ')
  assert.equal(/essentials|external|memory|efficiency/.test(ids), false)
  assert.ok(ids.includes('session-environment'))
  assert.ok(ids.includes('sidebar-workbench'))
})

test('dsh-context and session-notebook licenses stay Apache-2.0', () => {
  assert.equal(findCatalogItem('dsh-context')?.license, 'Apache-2.0')
  assert.equal(findCatalogItem('dsh-session-notebook')?.license, 'Apache-2.0')
})
