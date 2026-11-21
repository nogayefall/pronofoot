import { useId } from 'react'

const ICON_PATHS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="m12 8 2.5 1.8-.9 2.9h-3.2l-.9-2.9L12 8Z" /><path d="m12 3 0 5m8 1-5.5.8M18 18l-4.4-5.3M6 18l4.4-5.3M4 9l5.5.8" /></>,
  sliders: <><path d="M4 6h9m4 0h3M4 12h3m4 0h9M4 18h9m4 0h3" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="18" r="2" /></>,
  flask: <><path d="M9 3h6m-5 0v6l-5.3 8.1A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.1-3.9L14 9V3M8 15h8" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></>,
  chart: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1-1.5.9-.2 1.9h-2.8l-.3-1.9-1.6-.9-.2-.1-1.7.7-1.4-2.4 1.5-1.1v-2l-1.5-1.1 1.4-2.4 1.7.7 1.8-1V6.4h2.8l.3 1.9 1.6.9.2.1 1.7-.7 1.4 2.4-1.5 1.1v2Z" transform="translate(-1.2 -1)" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  shield: <><path d="M12 3 20 6v5c0 5.1-3.4 8.3-8 10-4.6-1.7-8-4.9-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" /><path d="M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16" /><path d="M20 20v-4h-4" /></>,
  logout: <><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="M15 16l4-4-4-4M19 12H9" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
}

export function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name] ?? ICON_PATHS.grid}
    </svg>
  )
}

/** Logo PronoFoot : un cercle traversé d'une ligne de pouls. */
export function Logo({ size = 30 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M5 16.5h5.2l2.3-5 3.6 10.5 3-8.2 1.6 2.7H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Brand({ href = '/admin' }) {
  return (
    <a className="brand" href={href}>
      <Logo />
      <span className="brand-name">Prono<span>Foot</span></span>
    </a>
  )
}

/** Pastille d'état : la couleur accompagne toujours un libellé. */
export function Pill({ tone = 'watch', children, dot = true }) {
  return <span className={`pill pill-${tone}`}>{dot && <span className="pill-dot" aria-hidden="true" />}{children}</span>
}

export function VitalityBar({ value, minimum = 41 }) {
  const known = typeof value === 'number' && Number.isFinite(value)
  const width = known ? Math.max(0, Math.min(100, value)) : 0
  const low = !known || value < minimum

  return (
    <span className="vitality">
      <span className="num vitality-value">{known ? Math.round(value) : 'n.c.'}</span>
      <span className="vitality-track" role="img" aria-label={known ? `Vitalité ${Math.round(value)} sur 100${low ? ', sous le minimum' : ''}` : 'Vitalité non calculable'}>
        <span className={`vitality-fill ${low ? 'vitality-low' : ''}`} style={{ width: `${width}%` }} />
      </span>
    </span>
  )
}

export function MetricCard({ label, value, unit, caption, tone }) {
  return (
    <article className="metric-card">
      <h2 className="metric-label">{label}</h2>
      <p className="metric-value"><span className={`num ${tone ? `metric-${tone}` : ''}`}>{value}</span>{unit && <span className="metric-unit">{unit}</span>}</p>
      {caption && <p className="metric-caption">{caption}</p>}
    </article>
  )
}

export function EmptyState({ icon, title, message }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} size={22} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

export function Section({ title, aside, action, children, className = '' }) {
  const headingId = useId()

  return (
    <section className={`section ${className}`} aria-labelledby={headingId}>
      <div className="section-heading">
        <h2 id={headingId}>{title}</h2>
        {aside && <p className="section-aside">{aside}</p>}
        {action}
      </div>
      {children}
    </section>
  )
}

function AlertFigure({ label, value, accent = false }) {
  return (
    <div className="alert-figure">
      <dt>{label}</dt>
      <dd className={`num ${accent ? 'figure-accent' : ''}`}>{value ?? '—'}</dd>
    </div>
  )
}

/**
 * Carte d'une alerte active. Les valeurs viennent du message réel de l'alerte ; s'il ne suit pas
 * le format attendu, le texte brut est affiché.
 */
export function AlertCard({ alert, parsed, competition, ruleTitle, countdown }) {
  if (!parsed) {
    return (
      <article className="alert-card alert-card-other">
        <div className="alert-card-top"><Pill tone="other">Alerte</Pill></div>
        <h3>{alert.match ?? 'Rencontre'}</h3>
        <p className="alert-raw">{alert.message}</p>
        <p className="alert-meta">Expire dans <span className="num">{countdown}</span></p>
      </article>
    )
  }

  const figures = parsed.target || parsed.suggestedScore
    ? [['Score suggéré', parsed.suggestedScore ?? parsed.target, true], ['Cote', parsed.odds[0]?.value], ['Écart', parsed.gap]]
    : [['Pari', parsed.bet, true], ...parsed.odds.slice(0, 2).map((odd) => [odd.label, odd.value])]

  return (
    <article className={`alert-card alert-card-${parsed.level}`}>
      <div className="alert-card-top">
        <Pill tone={parsed.level}>{parsed.label}</Pill>
        <span className="num alert-clock">{[parsed.minute === null ? null : `${parsed.minute}'`, parsed.score].filter(Boolean).join(' · ')}</span>
      </div>
      <h3>{parsed.match}</h3>
      <p className="alert-context">{[competition, ruleTitle].filter(Boolean).join(' · ')}</p>
      <dl className="alert-figures">
        {figures.map(([label, value, accent]) => <AlertFigure key={label} label={label} value={value} accent={accent} />)}
      </dl>
      {parsed.options.length > 0 && <ul className="alert-options" aria-label="Options proposées (aucune n’est jouée automatiquement)">{parsed.options.map((option) => <li key={option.label}><strong>{option.label}</strong> {option.text}</li>)}</ul>}
      {parsed.vitalityNote && <p className="alert-note">{parsed.vitalityNote}</p>}
      <p className="alert-meta">
        Expire dans <span className="num">{countdown}</span>
        {alert.channel && <> · {alert.channel === 'telegram' ? 'Telegram' : alert.channel === 'log' ? 'journal' : alert.channel}{alert.status === 'queued' ? ' (en file)' : ''}{alert.fallbackUsed ? ' · repli' : ''}</>}
      </p>
    </article>
  )
}

/**
 * Commutateur du mode de scan : Automatique / Manuel, et Pause / Reprendre. Pris en compte au tour suivant du scan.
 */
export function ScanModeControl({ scanMode, label, busy, onMode, onPause }) {
  const mode = scanMode?.mode ?? 'auto'
  const paused = scanMode?.paused === true

  return (
    <div className="scan-mode panel">
      <div className="scan-mode-state">
        <span className="scan-mode-title">Mode de scan</span>
        <Pill tone={paused ? 'dead' : 'alert'}>{label}</Pill>
      </div>
      <div className="segmented" role="group" aria-label="Mode de scan">
        <button type="button" aria-pressed={mode === 'auto'} disabled={busy || !scanMode} onClick={() => onMode('auto')}>Automatique</button>
        <button type="button" aria-pressed={mode === 'manual'} disabled={busy || !scanMode} onClick={() => onMode('manual')}>Manuel</button>
      </div>
      <button className={`button button-compact ${paused ? 'button-primary' : 'button-ghost'}`} type="button" disabled={busy || !scanMode} onClick={() => onPause(!paused)}>{paused ? 'Reprendre' : 'Pause'}</button>
      <p className="scan-mode-help">{mode === 'manual' ? 'Seuls les matchs ajoutés à la main sont scannés.' : 'Les 7 championnats suivis et les matchs ajoutés à la main sont scannés.'}{paused ? ' En pause : aucun appel API.' : ''}</p>
    </div>
  )
}

/**
 * Options d’une alerte dans le Journal : décision (jouée / ignorée) et résultat (automatique, corrigeable à la main).
 */
export function AlertOptionsEditor({ log, busy, decisions, outcomes, onOption, onLegacyOutcome }) {
  if (!log.alert) return <span>—</span>
  const options = log.alert.options ?? []
  if (!options.length) {
    return (
      <label className="option-field">Résultat
        <select className="select-compact" value={log.outcome ?? ''} disabled={busy} onChange={(event) => onLegacyOutcome(log.id, event.target.value)}>
          <option value="">À renseigner</option><option value="won">Gagnée</option><option value="lost">Perdue</option><option value="cancelled">Annulée</option>
        </select>
      </label>
    )
  }

  return (
    <ul className="option-list">
      {options.map((option) => (
        <li key={option.id} className="option-item">
          <div className="option-head">
            <strong>{option.label}</strong>
            <span className="num">{[option.line, option.scoreKey ? `score ${option.scoreKey}` : null, option.odds ? `cote ${Number(option.odds).toFixed(2)}` : null].filter(Boolean).join(' · ')}</span>
          </div>
          <div className="option-controls">
            <label className="option-field">Décision
              <select value={option.decision} disabled={busy} onChange={(event) => onOption(option.id, { decision: event.target.value })}>
                {decisions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="option-field">Résultat
              <select value={option.outcome} disabled={busy} onChange={(event) => onOption(option.id, { outcome: event.target.value })}>
                {outcomes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            {option.outcomeSource && <Pill tone={option.outcomeSource === 'auto' ? 'watch' : 'high'} dot={false}>{option.outcomeSource === 'auto' ? 'Auto' : 'Manuel'}</Pill>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ReasonText({ text, limit = 160 }) {
  if (!text) return <span>—</span>
  if (text.length <= limit) return <span>{text}</span>
  const cut = text.slice(0, limit)
  const short = cut.slice(0, Math.max(cut.lastIndexOf(' '), limit * 0.6))

  return (
    <details className="reason-text">
      <summary><span className="reason-short">{short}…</span> <span className="reason-toggle reason-more">Voir plus</span><span className="reason-toggle reason-less">Réduire</span></summary>
      <span className="reason-full">{text}</span>
    </details>
  )
}
