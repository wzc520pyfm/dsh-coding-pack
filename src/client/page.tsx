import React, { useEffect, useMemo, useState } from 'react'
import type { CatalogCategory, CatalogItem, ExclusiveChoice, FutureSlot, HostLine, InstallResponse, StatusResponse, UiLocale, UserSettings } from '../shared/types.ts'
import { fetchCatalog, fetchStatus, runInstall, saveSettings } from './api.ts'
import { translate, type MessageKey } from './i18n.ts'

interface PageProps {
  catalog?: { categories: CatalogCategory[]; futureSlots: FutureSlot[]; pinnedAsOf: string }
}

export function WorkbenchPage(_props: PageProps): React.ReactElement {
  const [locale, setLocale] = useState<UiLocale>('en')
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [futureSlots, setFutureSlots] = useState<FutureSlot[]>([])
  const [pinnedAsOf, setPinnedAsOf] = useState('')
  const [exclusive, setExclusive] = useState<Record<string, ExclusiveChoice>>({})
  const [extras, setExtras] = useState<string[]>([])
  const [hostLineOverride, setHostLineOverride] = useState<HostLine | undefined>()
  const [nbAck, setNbAck] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<InstallResponse | null>(null)
  const t = (key: MessageKey) => translate(locale, key)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchCatalog(), fetchStatus()])
      .then(([catalog, next]) => {
        if (cancelled) return
        setCategories(catalog.categories)
        setFutureSlots(catalog.futureSlots)
        setPinnedAsOf(catalog.pinnedAsOf)
        applyStatus(next)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t('loadFailed'))
      })
    return () => { cancelled = true }
  }, [])

  function applyStatus(next: StatusResponse): void {
    setStatus(next)
    setLocale(next.settings.locale)
    setExclusive({ ...next.settings.exclusive })
    setExtras([...next.settings.extras])
    setHostLineOverride(next.settings.hostLineOverride)
    setNbAck(next.settings.nbPluginAcknowledged === true)
  }

  const settingsPatch = useMemo((): Partial<UserSettings> => ({
    locale,
    exclusive,
    extras,
    hostLineOverride,
    nbPluginAcknowledged: nbAck,
  }), [locale, exclusive, extras, hostLineOverride, nbAck])

  async function persist(patch: Partial<UserSettings> = settingsPatch): Promise<void> {
    try {
      const saved = await saveSettings(patch)
      setLocale(saved.locale)
      setExclusive({ ...saved.exclusive })
      setExtras([...saved.extras])
      setHostLineOverride(saved.hostLineOverride)
      setNbAck(saved.nbPluginAcknowledged === true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveFailed'))
    }
  }

  async function onInstall(request: Parameters<typeof runInstall>[0] = settingsPatch): Promise<void> {
    setBusy(true)
    setError(null)
    try {
      await persist(request)
      const outcome = await runInstall(request)
      setResult(outcome)
      const refreshed = await fetchStatus()
      applyStatus(refreshed)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loadFailed'))
    } finally {
      setBusy(false)
    }
  }

  const nbSelected = extras.includes('dsh-nb-plugin')
  const text = (item: { en: string; zh: string }) => locale === 'zh' ? item.zh : item.en

  return (
    <div className="dsh-cwp">
      <header>
        <h1>{t('title')}</h1>
        <p className="muted">{t('subtitle')}</p>
        <p className="muted">{t('commandHint')}</p>
        {pinnedAsOf ? <p className="muted">{t('pinsAsOf')}: {pinnedAsOf}</p> : null}
        <div className="toolbar">
          <label>
            {t('language')}{' '}
            <select
              value={locale}
              aria-label={t('language')}
              onChange={event => {
                const next = event.target.value === 'zh' ? 'zh' : 'en'
                setLocale(next)
                void persist({ ...settingsPatch, locale: next })
              }}
            >
              <option value="en">{t('english')}</option>
              <option value="zh">{t('chinese')}</option>
            </select>
          </label>
          <label>
            {t('hostLine')}{' '}
            <select
              value={hostLineOverride ?? ''}
              aria-label={t('hostLine')}
              onChange={event => {
                const value = event.target.value
                const next = value === 'v022' || value === 'v021' ? value : undefined
                setHostLineOverride(next)
                void persist({ ...settingsPatch, hostLineOverride: next })
              }}
            >
              <option value="">{t('hostAuto')}</option>
              <option value="v022">{t('hostV022')}</option>
              <option value="v021">{t('hostV021')}</option>
            </select>
          </label>
        </div>
        <p>
          {t('hostVersion')}: <span className="path">{status?.host.parsed ?? status?.host.raw ?? '—'}</span>
          {status?.host.line ? ` (${status.host.line})` : ''}
        </p>
        {status?.host.line === 'unknown' && exclusive['sidebar-workbench'] === 'dsh-better-sidebar' && !hostLineOverride ? (
          <div className="banner warn">{t('hostUnavailable')}</div>
        ) : null}
        {status?.inventoryWarnings.map(warning => (
          <div className="banner warn" key={warning.en}>{text(warning)}</div>
        ))}
        {error ? <div className="banner warn" role="alert">{error}</div> : null}
      </header>

      {categories.map(category => (
        <section className="category" key={category.id}>
          <h2>{text(category.title)}</h2>
          <p className="muted">{text(category.blurb)}</p>
          {category.items.filter(item => item.role === 'official').map(item => (
            <OfficialRow key={item.id} item={item} locale={locale} officialLabel={t('official')} />
          ))}
          {category.exclusive ? (
            <>
              {category.items.filter(item => item.installable).map(item => (
                <label className="item" key={item.id}>
                  <input
                    type="radio"
                    name={`cwp-${category.id}`}
                    checked={exclusive[category.id] === item.id}
                    onChange={() => {
                      const next = { ...exclusive, [category.id]: item.id }
                      setExclusive(next)
                      void persist({ ...settingsPatch, exclusive: next })
                    }}
                  />
                  <span>
                    <strong>{item.packageName ?? item.id}</strong>{' '}
                    <RoleBadge role={item.role} t={t} />
                    <div className="muted">{text(item.summary)}</div>
                  </span>
                </label>
              ))}
              {category.skippable ? (
                <label className="item">
                  <input
                    type="radio"
                    name={`cwp-${category.id}`}
                    checked={exclusive[category.id] === 'skip'}
                    onChange={() => {
                      const next = { ...exclusive, [category.id]: 'skip' as const }
                      setExclusive(next)
                      void persist({ ...settingsPatch, exclusive: next })
                    }}
                  />
                  <span>{t('skipCategory')}</span>
                </label>
              ) : null}
            </>
          ) : (
            category.items.filter(item => item.installable).map(item => (
              <label className="item" key={item.id}>
                <input
                  type="checkbox"
                  checked={extras.includes(item.id)}
                  onChange={event => {
                    const next = event.target.checked
                      ? [...extras, item.id]
                      : extras.filter(id => id !== item.id)
                    setExtras(next)
                    if (!next.includes('dsh-nb-plugin')) setNbAck(false)
                    void persist({ ...settingsPatch, extras: next, nbPluginAcknowledged: next.includes('dsh-nb-plugin') ? nbAck : false })
                  }}
                />
                <span>
                  <strong>{item.packageName ?? item.id}</strong>{' '}
                  <RoleBadge role={item.role} t={t} />
                  <div className="muted">{text(item.summary)}</div>
                </span>
              </label>
            ))
          )}
        </section>
      ))}

      {nbSelected ? (
        <div className="banner warn" role="region" aria-label={t('nbWarningTitle')}>
          <h3>{t('nbWarningTitle')}</h3>
          <p>{t('nbWarningBody')}</p>
          <label>
            <input
              type="checkbox"
              checked={nbAck}
              onChange={event => {
                setNbAck(event.target.checked)
                void persist({ ...settingsPatch, nbPluginAcknowledged: event.target.checked })
              }}
            />{' '}
            {t('nbAck')}
          </label>
        </div>
      ) : null}

      <section className="category" aria-label={t('futureTitle')}>
        <h2>{t('futureTitle')}</h2>
        <p className="muted">{t('futureBlurb')}</p>
        {futureSlots.map(slot => (
          <div className="item future" key={slot.id}>
            <div>
              <strong>{slot.suggestedName}</strong> <span className="badge">{t('undelivered')}</span>
              <div>{text(slot.name)}</div>
              <div className="muted">{text(slot.summary)}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="toolbar">
        <button
          type="button"
          className="primary"
          disabled={busy || (nbSelected && !nbAck)}
          onClick={() => void onInstall()}
        >
          {busy ? t('installing') : t('installSelected')}
        </button>
      </div>

      {result ? (
        <section className="results" aria-live="polite">
          <h2>{t('results')}</h2>
          {result.restartRecommended ? <div className="banner">{t('restart')}</div> : null}
          <ul>
            {result.outcomes.map(item => (
              <li key={item.itemId}>
                <span className="path">{item.packageName}</span> — {item.status}
                {item.target ? <> → <span className="path">{item.target}</span></> : null}
                <div className="muted">{text(item.message)}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result?.pendingAllowBuilds ? (
        <AllowBuildsPrompt
          t={t}
          keys={result.pendingAllowBuilds.keys}
          message={text(result.pendingAllowBuilds.message)}
          busy={busy}
          onCancel={() => setResult(current => current ? { ...current, pendingAllowBuilds: undefined } : current)}
          onConfirm={() => void onInstall({
            ...settingsPatch,
            retryItemId: result.pendingAllowBuilds!.itemId,
            confirmAllowBuilds: result.pendingAllowBuilds!.keys,
          })}
        />
      ) : null}
    </div>
  )
}

function OfficialRow({ item, locale, officialLabel }: { item: CatalogItem; locale: UiLocale; officialLabel: string }): React.ReactElement {
  const text = locale === 'zh' ? item.summary.zh : item.summary.en
  const name = locale === 'zh' ? item.name.zh : item.name.en
  return (
    <div className="item official">
      <div>
        <strong>{name}</strong> <span className="badge">{officialLabel}</span>
        <div className="muted">{text}</div>
      </div>
    </div>
  )
}

function RoleBadge({ role, t }: { role: CatalogItem['role']; t: (key: MessageKey) => string }): React.ReactElement | null {
  if (role === 'default') return <span className="badge">{t('defaultLabel')}</span>
  if (role === 'alternative') return <span className="badge">{t('alternative')}</span>
  if (role === 'optional') return <span className="badge">{t('optional')}</span>
  if (role === 'extension') return <span className="badge">{t('extension')}</span>
  return null
}

function AllowBuildsPrompt(props: {
  t: (key: MessageKey) => string
  keys: readonly string[]
  message: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}): React.ReactElement {
  return (
    <div className="banner warn" role="dialog" aria-labelledby="cwp-allow-title">
      <h3 id="cwp-allow-title">{props.t('allowBuildsTitle')}</h3>
      <p>{props.t('allowBuildsBody')}</p>
      <p>{props.message}</p>
      <p className="path">{props.keys.join(', ') || '—'}</p>
      <div className="toolbar">
        <button type="button" className="primary" disabled={props.busy || props.keys.length === 0} onClick={props.onConfirm}>
          {props.t('confirmAllow')}
        </button>
        <button type="button" className="secondary" onClick={props.onCancel}>{props.t('cancel')}</button>
      </div>
    </div>
  )
}
