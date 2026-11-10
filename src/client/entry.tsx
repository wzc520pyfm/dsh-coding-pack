import React from 'react'
import { PLUGIN_ID, SETTINGS_SECTION_ID } from '../shared/types.ts'
import { WorkbenchPage } from './page.tsx'
import { ensureStyles } from './styles.ts'
import { translate } from './i18n.ts'

export const name = PLUGIN_ID
export const inject = ['slots', 'locale']

interface ClientContext {
  slots: {
    inject(name: string, register: () => (() => void) | Generator<() => void>): () => void
    register(def: Record<string, unknown>, component: (props: unknown) => React.ReactElement | null): () => void
  }
  locale?: { getSnapshot?: () => { locale?: string; lang?: string } }
  effect?(callback: () => void | (() => void), label?: string): void
}

export function apply(ctx: ClientContext): void {
  ensureStyles()
  const register = () => ctx.slots.inject('settings.section', () =>
    ctx.slots.register({
      name: 'settings.section',
      id: SETTINGS_SECTION_ID,
      order: 85,
      locale: 'codingWorkbench',
      registrant: PLUGIN_ID,
      label: () => translate(currentLocale(ctx), 'nav'),
    }, () => <WorkbenchPage />),
  )
  if (ctx.effect) ctx.effect(register, 'dsh-coding-pack: settings')
  else register()
}

function currentLocale(ctx: ClientContext): 'en' | 'zh' {
  const snapshot = ctx.locale?.getSnapshot?.()
  const value = `${snapshot?.locale ?? snapshot?.lang ?? ''}`
  return value.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
