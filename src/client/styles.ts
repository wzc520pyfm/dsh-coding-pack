const STYLE_ID = 'dsh-coding-workbench-pack-styles'

export function ensureStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
.dsh-cwp { --cwp-border: color-mix(in srgb, currentColor 16%, transparent); --cwp-fill: color-mix(in srgb, currentColor 6%, transparent); --cwp-accent: #1f2937; color: inherit; font: inherit; max-width: 52rem; padding: 0 0 2rem; }
.dsh-cwp h1, .dsh-cwp h2, .dsh-cwp h3 { margin: 0 0 .4rem; font-weight: 650; }
.dsh-cwp p, .dsh-cwp li { line-height: 1.5; }
.dsh-cwp .muted { opacity: .78; }
.dsh-cwp header { margin-bottom: 1.25rem; }
.dsh-cwp .toolbar { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: center; margin: .75rem 0 1rem; }
.dsh-cwp .banner { border: 1px solid var(--cwp-border); background: var(--cwp-fill); border-radius: 10px; padding: .75rem 1rem; margin: .75rem 0; }
.dsh-cwp .banner.warn { border-color: color-mix(in srgb, #b45309 45%, var(--cwp-border)); }
.dsh-cwp section.category { border: 1px solid var(--cwp-border); border-radius: 12px; padding: 1rem 1rem .85rem; margin: 1rem 0; }
.dsh-cwp .item { display: grid; grid-template-columns: 1.25rem 1fr; gap: .55rem .7rem; padding: .55rem 0; border-top: 1px solid var(--cwp-border); }
.dsh-cwp .item:first-of-type { border-top: 0; }
.dsh-cwp .item.official, .dsh-cwp .item.future { grid-template-columns: 1fr; }
.dsh-cwp .badge { display: inline-block; margin-right: .4rem; padding: .05rem .4rem; border-radius: 999px; border: 1px solid var(--cwp-border); font-size: .75rem; }
.dsh-cwp button.primary, .dsh-cwp button.secondary { border-radius: 8px; padding: .45rem .9rem; font: inherit; cursor: pointer; }
.dsh-cwp button.primary { background: var(--cwp-accent, #1f2937); color: #fff; border: 1px solid transparent; }
.dsh-cwp button.primary:disabled { opacity: .55; cursor: not-allowed; }
.dsh-cwp button.secondary { background: transparent; border: 1px solid var(--cwp-border); color: inherit; }
.dsh-cwp .results { margin-top: 1rem; }
.dsh-cwp dialog { border: 1px solid var(--cwp-border); border-radius: 12px; padding: 1rem 1.1rem; max-width: 32rem; }
.dsh-cwp .path { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .9em; }
`
  document.head.appendChild(style)
}
