import { API_PREFIX } from '../shared/types.ts'
import type { InstallRequest, InstallResponse, StatusResponse, UserSettings } from '../shared/types.ts'
import type { CatalogCategory, FutureSlot } from '../shared/types.ts'

export class HostApiError extends Error {
  constructor(readonly code: string, message: string) {
    super(message)
    this.name = 'HostApiError'
  }
}

export interface CatalogResponse {
  categories: CatalogCategory[]
  futureSlots: FutureSlot[]
  pinnedAsOf: string
}

export const fetchCatalog = (signal?: AbortSignal) => post<CatalogResponse>('catalog', {}, signal)
export const fetchStatus = (signal?: AbortSignal) => post<StatusResponse>('status', {}, signal)
export const saveSettings = (patch: Partial<UserSettings>, signal?: AbortSignal) => post<UserSettings>('settings', patch, signal)
export const runInstall = (request: InstallRequest, signal?: AbortSignal) => post<InstallResponse>('install', request, signal)

async function post<T>(route: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_PREFIX}/${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body ?? {}),
    signal,
  })
  const payload = await response.json().catch(() => null) as
    | { ok?: boolean; data?: T; error?: { code?: string; message?: string } }
    | null
  if (!response.ok || !payload?.ok) {
    throw new HostApiError(payload?.error?.code ?? 'request_failed', payload?.error?.message ?? 'The host request failed')
  }
  return payload.data as T
}
