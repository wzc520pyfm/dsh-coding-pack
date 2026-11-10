import assert from 'node:assert/strict'
import { test } from 'node:test'
import { inventoryWarnings, mergeRequest, normalizeSettings, planSelection, selectedItems } from '../src/shared/policy.ts'
import type { HostVersionInfo, InventorySnapshot, UserSettings } from '../src/shared/types.ts'

function inventory(packages: InventorySnapshot['packages'], extras?: Partial<InventorySnapshot>): InventorySnapshot {
  return {
    profile: 'web',
    profileDir: '/tmp/profile',
    packages,
    starterPackInstalled: false,
    allowBuilds: { filePath: null, exists: false, entries: {}, hasWildcard: false, wildcardKeys: [] },
    ...extras,
  }
}

function host(line: HostVersionInfo['line'], parsed = '0.2.2-rc.1'): HostVersionInfo {
  return { raw: parsed, parsed, line, source: line === 'unknown' ? 'unavailable' : 'dsh-version' }
}

function settings(overrides?: Partial<UserSettings>): UserSettings {
  return normalizeSettings(overrides)
}

test('default plan installs the locked set and skips official / future / optionals', () => {
  const selection = mergeRequest(settings(), {}, 'v022')
  const ids = selectedItems(selection).map(item => item.id)
  assert.deepEqual(ids, ['session-rail', 'dsh-codex-review-sidebar', 'dsh-context', 'dsh-better-sidebar', 'dsh-handy'])
  const plan = planSelection(selection, inventory({}), host('v022'))
  assert.deepEqual(Object.fromEntries(plan.map(item => [item.itemId, item.status])), {
    'session-rail': 'install',
    'dsh-codex-review-sidebar': 'install',
    'dsh-context': 'install',
    'dsh-better-sidebar': 'install',
    'dsh-handy': 'install',
  })
  assert.equal(plan.find(item => item.itemId === 'dsh-better-sidebar')?.target, 'dsh-better-sidebar@0.30.1')
  assert.equal(plan.some(item => /@latest/.test(item.target)), false)
  assert.equal(plan.some(item => ['dsh-suggest-card', 'dsh-worktrunk', 'dsh-new-workspace', 'composer-branch'].includes(item.itemId)), false)
})

test('mutual exclusion: UI selections cannot include two of the same class, and an already-installed rival is blocked', () => {
  const selection = mergeRequest(settings({ exclusive: { 'session-environment': 'session-rail' } }), {}, 'v022')
  assert.equal(selection.exclusive['session-environment'], 'session-rail')
  const rejected = normalizeSettings({ exclusive: { 'session-environment': 'session-rail,dsh-session-rail' as never } })
  assert.equal(rejected.exclusive['session-environment'], 'session-rail')
  const plan = planSelection(
    mergeRequest(settings(), {}, 'v022'),
    inventory({ 'dsh-session-rail': { packageName: 'dsh-session-rail', version: '0.1.16', specifier: '0.1.16', source: 'dependencies' } }),
    host('v022'),
  )
  const rail = plan.find(item => item.itemId === 'session-rail')
  assert.equal(rail?.status, 'blocked-conflict')
  assert.match(rail?.message.en ?? '', /dsh-session-rail/)
})

test('skip-if-installed when the version already meets the pin', () => {
  const plan = planSelection(
    mergeRequest(settings(), {}, 'v022'),
    inventory({ 'session-rail': { packageName: 'session-rail', version: '0.1.3', specifier: '0.1.3', source: 'node_modules' } }),
    host('v022'),
  )
  assert.equal(plan.find(item => item.itemId === 'session-rail')?.status, 'skip-installed')
})

test('does not auto-upgrade a lower installed version', () => {
  const plan = planSelection(
    mergeRequest(settings(), {}, 'v022'),
    inventory({ 'dsh-context': { packageName: 'dsh-context', version: '0.80.0', specifier: '0.80.0', source: 'node_modules' } }),
    host('v022'),
  )
  const context = plan.find(item => item.itemId === 'dsh-context')
  assert.equal(context?.status, 'blocked-upgrade')
  assert.match(context?.message.en ?? '', /does not auto-upgrade/)
})

test('future slots cannot be selected or planned as installable defaults', () => {
  const normalized = normalizeSettings({ extras: ['dsh-suggest-card', 'dsh-new-workspace', 'dsh-worktrunk'] })
  assert.deepEqual(normalized.extras, [])
  const selection = mergeRequest(settings(), { extras: ['dsh-suggest-card'] }, 'v022')
  assert.deepEqual(selection.extras, [])
})

test('better-sidebar host-line selection aborts when the line is unknown and no manual pick is provided', () => {
  const auto = planSelection(mergeRequest(settings(), {}, 'unknown'), inventory({}), host('unknown', null as unknown as string))
  const item = auto.find(entry => entry.itemId === 'dsh-better-sidebar')
  assert.equal(item?.status, 'blocked-host-line')
  assert.match(item?.message.en ?? '', /never installs @latest/)
  const manual = planSelection(
    mergeRequest(settings(), { hostLineOverride: 'v021' }, 'unknown'),
    inventory({}),
    host('unknown'),
  )
  assert.equal(manual.find(entry => entry.itemId === 'dsh-better-sidebar')?.target, 'dsh-better-sidebar@0.28.2')
})

test('Jupyter is blocked unless better-sidebar is selected or already installed', () => {
  const without = mergeRequest(settings({ exclusive: { 'sidebar-workbench': 'skip' }, extras: ['dsh-better-sidebar-jupyter'] }), {}, 'v022')
  const blocked = planSelection(without, inventory({}), host('v022')).find(item => item.itemId === 'dsh-better-sidebar-jupyter')
  assert.equal(blocked?.status, 'blocked-dependency')
  const withSelected = mergeRequest(settings({ extras: ['dsh-better-sidebar-jupyter'] }), {}, 'v022')
  assert.equal(planSelection(withSelected, inventory({}), host('v022')).find(item => item.itemId === 'dsh-better-sidebar-jupyter')?.status, 'install')
  const already = mergeRequest(settings({ exclusive: { 'sidebar-workbench': 'skip' }, extras: ['dsh-better-sidebar-jupyter'] }), {}, 'v022')
  const ok = planSelection(
    already,
    inventory({ 'dsh-better-sidebar': { packageName: 'dsh-better-sidebar', version: '0.30.1', specifier: '0.30.1', source: 'node_modules' } }),
    host('v022'),
  )
  assert.equal(ok.find(item => item.itemId === 'dsh-better-sidebar-jupyter')?.status, 'install')
})

test('nb-plugin requires an explicit restore-input acknowledgement and is never a default', () => {
  const defaults = mergeRequest(settings(), {}, 'v022')
  assert.equal(defaults.extras.includes('dsh-nb-plugin'), false)
  const unchecked = mergeRequest(settings({ extras: ['dsh-nb-plugin'] }), {}, 'v022')
  const blocked = planSelection(unchecked, inventory({}), host('v022')).find(item => item.itemId === 'dsh-nb-plugin')
  assert.equal(blocked?.status, 'blocked-ack')
  assert.match(blocked?.message.en ?? '', /Cmd\+Shift\+H/)
  const acked = mergeRequest(settings({ extras: ['dsh-nb-plugin'], nbPluginAcknowledged: true }), {}, 'v022')
  assert.equal(planSelection(acked, inventory({}), host('v022')).find(item => item.itemId === 'dsh-nb-plugin')?.status, 'install')
})

test('starter-pack and wildcard allowBuilds produce warnings but are not auto-rewritten by policy', () => {
  const warnings = inventoryWarnings(inventory({}, {
    starterPackInstalled: true,
    allowBuilds: { filePath: '/tmp/pnpm-workspace.yaml', exists: true, entries: { '*': true }, hasWildcard: true, wildcardKeys: ['*'] },
  }))
  assert.equal(warnings.length, 2)
  assert.match(warnings[0]!.en, /dsh-starter-pack/)
  assert.match(warnings[0]!.en, /will not uninstall/)
  assert.match(warnings[1]!.en, /wildcard/)
  assert.match(warnings[1]!.en, /will not silently change/)
})
