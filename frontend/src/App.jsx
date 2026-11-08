import { useEffect, useState } from 'react'
import { createRuleTestPayload, requestAdminApi } from './adminData'
import './App.css'

const navigation = [
  { id: 'overview', label: 'Vue d’ensemble', icon: 'grid' },
  { id: 'matches', label: 'Matchs suivis', icon: 'ball' },
  { id: 'rules', label: 'Moteur de règles', icon: 'sliders' },
  { id: 'tester', label: 'Testeur manuel', icon: 'flask' },
  { id: 'journal', label: 'Journal', icon: 'list' },
  { id: 'statistics', label: 'Statistiques', icon: 'chart' },
  { id: 'settings', label: 'Paramètres', icon: 'settings' },
]

const ruleDescriptions = [
  { id: 'F121-C', title: 'Écart directionnel', status: 'Disponible', detail: 'Règle configurable selon les seuils validés du CDC.' },
  { id: 'F121-C.2', title: 'Avantage de deux buts', status: 'Disponible', detail: 'Suit le leader lorsque son avantage atteint au moins deux buts.' },
  { id: 'F121-D', title: 'Score élevé', status: 'Partiel', detail: 'Les situations hors cas documentés restent à confirmer.' },
  { id: 'F121-E', title: 'Règle de mi-temps / écart', status: 'À confirmer', detail: 'Les documents donnent deux définitions contradictoires.' },
  { id: 'F121-K · T · X', title: 'Écarts et tendance', status: 'Non défini', detail: 'La formule exacte doit être fournie avant activation.' },
  { id: 'F122 · F124 · F126', title: 'Règles complémentaires', status: 'Non défini', detail: 'Formules métier à confirmer par le client.' },
]

const settingLabels = {
  'scan.odds_interval_seconds': 'Fréquence de lecture des cotes (secondes)',
  'scan.statistics_interval_seconds': 'Fréquence des statistiques (secondes)',
  'scan.goal_interval_seconds': 'Fréquence de détection de but (secondes)',
  'scan.goal_window_seconds': 'Fenêtre de relance après un but (secondes)',
  'alerts.expiration_minutes': 'Expiration des alertes (minutes)',
  'rules.maximum_directional_gap': 'Écart directionnel maximal',
  'rules.zero_zero_odds_wait_threshold': 'Seuil de cote du score 0–0',
  'rules.zero_zero_gap_threshold': 'Seuil d’écart du score 0–0',
  'rules.upcoming_score_odds_limit': 'Limite de cote des scores suivants',
  'rules.minimum_vitality': 'Vitalité minimale',
  'rules.minimum_convergence_score': 'Convergence minimale',
  'tendance_source': 'Source de tendance (à confirmer)',
  'tendance_seuil_stable': 'Seuil de tendance stable (à confirmer)',
  'rules.vitality_normalization_references': 'Références de normalisation de la vitalité (à confirmer)',
}

const settingDescriptions = {
  'scan.odds_interval_seconds': 'Fréquence de mise à jour des cotes.',
  'scan.statistics_interval_seconds': 'Fréquence de mise à jour des statistiques.',
  'scan.goal_interval_seconds': 'Fréquence de vérification après un but.',
  'scan.goal_window_seconds': 'Durée de la vérification accélérée après un but.',
  'alerts.expiration_minutes': 'Durée avant qu’une alerte expire.',
  'rules.maximum_directional_gap': 'Écart maximal accepté pour la direction ciblée.',
  'rules.zero_zero_odds_wait_threshold': 'Cote de référence pour le score de 0 à 0.',
  'rules.zero_zero_gap_threshold': 'Écart maximal accepté pour le score de 0 à 0.',
  'rules.upcoming_score_odds_limit': 'Limite de cote pour les scores suivants.',
  'rules.minimum_vitality': 'Niveau minimal de vitalité requis.',
  'rules.minimum_convergence_score': 'Niveau minimal de convergence requis.',
  tendance_source: 'Valeur de cote utilisée pour calculer la tendance.',
  tendance_seuil_stable: 'Variation maximale considérée comme stable.',
  'rules.vitality_normalization_references': 'Valeurs de référence utilisées pour calculer la vitalité.',
}

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    ball: <><circle cx="12" cy="12" r="9" /><path d="m12 8 2.5 1.8-.9 2.9h-3.2l-.9-2.9L12 8Z" /><path d="m12 3 0 5m8 1-5.5.8M18 18l-4.4-5.3M6 18l4.4-5.3M4 9l5.5.8" /></>,
    sliders: <><path d="M4 6h9m4 0h3M4 12h3m4 0h9M4 18h9m4 0h3" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="18" r="2" /></>,
    flask: <><path d="M9 3h6m-5 0v6l-5.3 8.1A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.1-3.9L14 9V3M8 15h8" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></>,
    chart: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1-1.5.9-.2 1.9h-2.8l-.3-1.9-1.6-.9-.2-.1-1.7.7-1.4-2.4 1.5-1.1v-2l-1.5-1.1 1.4-2.4 1.7.7 1.8-1V6.4h2.8l.3 1.9 1.6.9.2.1 1.7-.7 1.4 2.4-1.5 1.1v2Z" transform="translate(-1.2 -1)" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 3 20 6v5c0 5.1-3.4 8.3-8 10-4.6-1.7-8-4.9-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  }

  return <svg {...common}>{paths[name] ?? paths.grid}</svg>
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  )
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} size={23} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

function SimulationResult({ result }) {
  const decision = result.decision
  const direction = result.rules['F121-C']?.details?.selectedTeam
  const directionLabel = direction === 'home' ? 'Équipe à domicile' : direction === 'away' ? 'Équipe à l’extérieur' : 'Direction indéterminée'

  return (
    <div className="simulation-result">
      <div className={`simulation-verdict ${decision.shouldAlert ? 'verdict-alert' : 'verdict-neutral'}`}>
        <span className="verdict-mark">{decision.shouldAlert ? '✓' : '—'}</span>
        <div><strong>{decision.shouldAlert ? 'Signal théorique détecté' : 'Aucun signal'}</strong><p>{decision.reason}</p></div>
      </div>
      <div className="simulation-section"><h3>Règles évaluées</h3>
        {Object.values(result.rules).map((rule) => (
          <div className="simulation-line" key={rule.ruleId}><span>{rule.ruleId}</span><strong>{rule.verdict === 'candidate' ? (rule.suggestedAction || directionLabel) : rule.verdict === 'not_defined' ? 'Non définie' : rule.verdict === 'abstain' ? 'Abstention' : 'Aucun signal'}</strong></div>
        ))}
      </div>
      <div className="simulation-section"><h3>Filtres de sécurité</h3>
        {Object.entries(result.filters).map(([filter, outcome]) => (
          <div className="simulation-line" key={filter}><span>{outcome.label}</span><strong className={outcome.passed ? 'filter-passed' : 'filter-failed'}>{outcome.passed ? 'Validé' : 'Refusé'}</strong></div>
        ))}
      </div>
      <div className="simulation-disclaimer"><Icon name="shield" size={17} /><span>{decision.convergenceScore === null ? 'Convergence non calculée : aucun score de méthode n’est fourni. Simulation sans alerte transmissible.' : `Convergence ${decision.convergenceScore} % — simulation uniquement.`}</span></div>
    </div>
  )
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('fr-FR') : '—'
}

function formatCountdown(value, now) {
  if (!value) return 'Sans expiration'
  if (!now) return 'Calcul…'
  const remaining = Math.max(0, Math.floor((Date.parse(value) - now) / 1000))
  return `${Math.floor(remaining / 60)} min ${String(remaining % 60).padStart(2, '0')} s`
}

function App() {
  const [activePage, setActivePage] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [matchesData, setMatchesData] = useState(null)
  const [settings, setSettings] = useState([])
  const [settingsDraft, setSettingsDraft] = useState({})
  const [settingsHistory, setSettingsHistory] = useState([])
  const [ruleProfile, setRuleProfile] = useState(null)
  const [profileDraft, setProfileDraft] = useState({ activeRules: [], methodWeights: {} })
  const [journalData, setJournalData] = useState(null)
  const [journalFilters, setJournalFilters] = useState({ date_from: '', date_to: '', match_id: '', rule_id: '', status: '' })
  const [statistics, setStatistics] = useState(null)
  const [statisticsFilters, setStatisticsFilters] = useState({ date_from: '', date_to: '' })
  const [apiError, setApiError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [now, setNow] = useState(0)
  const [testFields, setTestFields] = useState({
    homeScore: '0',
    awayScore: '0',
    oddsText: '0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80',
    vitalityScore: '61',
    oddsChangePercent: '0',
    tendanceSource: '',
    tendanceSeuilStable: '',
  })
  const [testResult, setTestResult] = useState(null)
  const [testError, setTestError] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? ''
  const adminName = document.querySelector('[data-admin-name]')?.dataset.adminName || 'Administrateur'
  const activeLabel = navigation.find((item) => item.id === activePage)?.label ?? 'Vue d’ensemble'

  useEffect(() => {
    let active = true
    requestAdminApi('/admin/api/dashboard', csrfToken)
      .then((result) => {
        if (active) setDashboard(result)
      })
      .catch((error) => {
        if (active) setApiError(error.message)
      })

    return () => { active = false }
  }, [csrfToken])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  async function adminRequest(path, method = 'GET', body) {
    setApiError('')
    setApiError('')
    try {
      return await requestAdminApi(path, csrfToken, { method, body })
    } catch (error) {
      setApiError(error.message)
      return null
    }
  }

  async function loadDashboard() {
    const result = await adminRequest('/admin/api/dashboard')
    if (result) setDashboard(result)
  }

  async function loadMatches() {
    const result = await adminRequest('/admin/api/matches')
    if (result) setMatchesData(result)
  }

  async function loadRuleProfile() {
    const result = await adminRequest('/admin/api/rule-profile')
    if (result) {
      setRuleProfile(result)
      setProfileDraft({
        activeRules: result.profile?.activeRules ?? [],
        methodWeights: result.profile?.methodWeights ?? {},
      })
    }
  }

  async function loadSettings() {
    const result = await adminRequest('/admin/api/settings')
    if (!result) return

    setSettings(result.settings)
    setSettingsDraft(Object.fromEntries(result.settings.map((setting) => [
      setting.key,
      setting.type === 'json' && setting.value !== null
        ? JSON.stringify(setting.value, null, 2)
        : setting.value ?? '',
    ])))
    const history = await adminRequest('/admin/api/settings/history')
    if (history) setSettingsHistory(history.data)
  }

  async function loadJournal(filters = journalFilters) {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== ''))
    const result = await adminRequest(`/admin/api/journal${params.size ? `?${params}` : ''}`)
    if (result) setJournalData(result)
  }

  async function loadStatistics(filters = statisticsFilters) {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== ''))
    const result = await adminRequest(`/admin/api/statistics${params.size ? `?${params}` : ''}`)
    if (result) setStatistics(result)
  }

  function selectPage(page) {
    setActivePage(page)
    setMobileMenuOpen(false)
    setActionMessage('')
    setApiError('')
    setTestResult(null)
    setTestError('')
    if (page === 'overview') void loadDashboard()
    if (page === 'matches') void loadMatches()
    if (page === 'rules') void loadRuleProfile()
    if (page === 'settings') void loadSettings()
    if (page === 'journal') void loadJournal()
    if (page === 'statistics') void loadStatistics()
  }

  const updateTestField = (field) => (event) => {
    setTestFields((previous) => ({ ...previous, [field]: event.target.value }))
    setTestResult(null)
    setTestError('')
  }

  async function testRules(event) {
    event.preventDefault()
    setIsTesting(true)
    setTestError('')
    setTestResult(null)
    try {
      const payload = createRuleTestPayload(testFields)
      const result = await requestAdminApi('/admin/rule-test', csrfToken, { method: 'POST', body: payload })
      setTestResult(result)
    } catch (error) {
      setTestError(error.message)
    } finally {
      setIsTesting(false)
    }
  }

  async function logout() {
    setLogoutError('')
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('La déconnexion a échoué. Réessaie.')
      window.location.assign('/login')
    } catch (error) {
      setLogoutError(error.message)
    }
  }

  async function toggleMatch(match) {
    setIsBusy(true)
    const result = match.tracked
      ? await adminRequest(`/admin/api/matches/${match.trackedId}`, 'DELETE')
      : await adminRequest('/admin/api/matches', 'POST', { provider_match_id: match.providerMatchId })
    if (result) {
      setActionMessage(match.tracked ? 'Rencontre retirée du suivi.' : 'Rencontre ajoutée au suivi.')
      await loadMatches()
      await loadDashboard()
    }
    setIsBusy(false)
  }

  async function saveSettings(event) {
    event.preventDefault()
    setIsBusy(true)
    try {
      const values = Object.fromEntries(settings.map((setting) => {
        const draft = settingsDraft[setting.key]
        if (setting.type === 'boolean') return [setting.key, draft === true]
        if (draft === '') return [setting.key, null]
        if (setting.type === 'integer' || setting.type === 'decimal') return [setting.key, Number(draft)]
        if (setting.type === 'json') return [setting.key, JSON.parse(draft)]
        return [setting.key, draft]
      }))
      const result = await adminRequest('/admin/api/settings', 'PATCH', { settings: values })
      if (result) {
        setActionMessage('Paramètres enregistrés.')
        await loadSettings()
      }
    } catch (error) {
      setApiError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  async function resetSettings() {
    setIsBusy(true)
    const result = await adminRequest('/admin/api/settings/reset', 'POST')
    if (result) {
      setActionMessage('Paramètres réinitialisés.')
      await loadSettings()
    }
    setIsBusy(false)
  }

  async function saveRuleProfile(event) {
    event.preventDefault()
    setIsBusy(true)
    const methodWeights = Object.fromEntries(Object.entries(profileDraft.methodWeights)
      .filter(([, weight]) => weight !== '' && weight !== null)
      .map(([rule, weight]) => [rule, Number(weight)]))
    const result = await adminRequest('/admin/api/rule-profile', 'PUT', {
      active_rules: profileDraft.activeRules,
      method_weights: methodWeights,
    })
    if (result) {
      setActionMessage('Profil de règles enregistré.')
      await loadRuleProfile()
    }
    setIsBusy(false)
  }

  async function runNotificationTest() {
    setIsBusy(true)
    const result = await adminRequest('/admin/notifications/test', 'POST', {})
    if (result) setActionMessage(`${result.message} Canal : ${result.channel}${result.fallbackUsed ? ' (repli utilisé)' : ''}${result.simulation ? ' — simulation' : ''}`)
    setIsBusy(false)
  }

  async function updateOutcome(logId, outcome) {
    const result = await adminRequest(`/admin/api/journal/${logId}/outcome`, 'PATCH', { outcome: outcome || null })
    if (result) {
      await loadJournal()
      await loadStatistics()
    }
  }

  const simulation = dashboard?.simulation || matchesData?.simulation
  const trackedMatches = dashboard?.trackedMatches ?? []
  const activeAlerts = dashboard?.activeAlerts ?? []

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="/admin"><span className="brand-mark">P</span><span><strong>PRONOFOOT</strong><small>ADMINISTRATION</small></span></a>
        <div className="sidebar-label">ESPACE ADMIN</div>
        <nav className="navigation" aria-label="Navigation principale">
          {navigation.map((item) => (
            <button className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`} key={item.id} onClick={() => selectPage(item.id)} type="button">
              <Icon name={item.icon} size={18} /><span>{item.label}</span>
              {item.id === 'matches' && <span className="nav-count">{trackedMatches.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="phase-card"><span className="phase-card-icon"><Icon name="shield" size={18} /></span><div><strong>Phase 1</strong><p>Détecteur live · aucun pari automatique</p></div></div>
        <button className="profile-button" type="button" onClick={logout}>
          <span className="avatar">{adminName.slice(0, 1).toUpperCase()}</span><span className="profile-copy"><strong>{adminName}</strong><small>Administrateur</small></span><span className="profile-exit">↗</span>
        </button>
        {logoutError && <p className="sidebar-error" role="alert">{logoutError}</p>}
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button" type="button" aria-label="Ouvrir le menu" onClick={() => setMobileMenuOpen((open) => !open)}><span /><span /><span /></button>
          <div className="breadcrumb"><span>Administration</span><Icon name="arrow" size={14} /><strong>{activeLabel}</strong></div>
          <div className="topbar-right"><span className="secure-label"><span className="secure-dot" /> Session sécurisée</span><span className="topbar-avatar">{adminName.slice(0, 1).toUpperCase()}</span></div>
        </header>

        <div className="content">
          {simulation && <div className="simulation-banner" role="status"><Icon name="shield" size={18} /><strong>Mode simulation :</strong> les données affichées proviennent d’au moins un pilote fictif.</div>}
          {apiError && <div className="form-error api-error" role="alert">{apiError}</div>}
          {actionMessage && <div className="success-message" role="status">{actionMessage}</div>}

          {activePage === 'overview' && (
            <div className="overview-page">
              <PageHeading eyebrow="TABLEAU DE BORD" title="Vue d’ensemble" description="État du détecteur et rencontres suivies." action={<button className="secondary-button" type="button" onClick={() => void loadDashboard()}>Actualiser</button>} />
              <section className="overview-highlights" aria-label="État du scan et alertes actives">
                <article className="scan-status-panel"><div className="scan-status-copy"><p className="overview-section-label">STATUT DU SCAN</p><h2>Détecteur de matchs</h2><p>Dernier passage : {formatDate(dashboard?.scan?.lastPassAt)}</p></div><span className={`scan-status-badge ${dashboard?.scan?.active ? 'scan-active' : ''}`}><span />{dashboard?.scan?.active ? 'Actif' : 'En attente'}</span></article>
                <article className="active-alerts-panel"><p className="overview-section-label">ALERTES ACTIVES</p><strong>{activeAlerts.length}</strong><p>{activeAlerts.length ? 'Alertes non expirées' : 'Aucune alerte en cours'}</p></article>
              </section>
              <section className="content-panel">
                <div className="panel-heading"><div><h2>Quotas fournisseurs</h2><p>État connu après la dernière consultation.</p></div></div>
                <div className="quota-grid">{['football', 'odds'].map((provider) => <div className="quota-card" key={provider}><strong>{provider === 'football' ? 'Football' : 'Cotes'}</strong><span>{dashboard?.quotas?.[provider] ?? 'Inconnu'}</span><small>{dashboard?.providerStatus?.[provider]?.message ?? 'Pas encore interrogé'}</small></div>)}</div>
              </section>
              <section className="overview-matches content-panel" aria-labelledby="overview-matches-title">
                <div className="overview-matches-heading"><div><p className="overview-section-label">SUIVI EN DIRECT</p><h2 id="overview-matches-title">Matchs suivis</h2></div><button className="overview-primary-action" type="button" onClick={() => selectPage('matches')}>Gérer les matchs <Icon name="arrow" size={18} /></button></div>
                {trackedMatches.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Rencontre</th><th>Score</th><th>Minute</th><th>Vitalité</th><th>Actualisé</th></tr></thead><tbody>{trackedMatches.map((match) => <tr key={match.id}><td>{match.homeTeam} – {match.awayTeam}<small>{match.competition}</small></td><td>{match.homeScore ?? '—'} – {match.awayScore ?? '—'}</td><td>{match.minute ?? '—'}</td><td>{match.vitality ?? '—'}</td><td>{formatDate(match.capturedAt)}</td></tr>)}</tbody></table></div> : <EmptyState icon="ball" title="Aucun match suivi" message="Ajoutez une rencontre depuis le pilote configuré." />}
              </section>
              <section className="content-panel"><div className="panel-heading"><div><h2>Alertes actives</h2><p>Le compte à rebours reflète l’expiration enregistrée.</p></div></div>{activeAlerts.length ? <div className="alert-list">{activeAlerts.map((alert) => <article className="alert-row" key={alert.id}><div><strong>{alert.match ?? 'Rencontre'}</strong><p>{alert.message}</p><small>{alert.channel} · {alert.status}{alert.fallbackUsed ? ' · repli' : ''}</small></div><span className="countdown">{formatCountdown(alert.expiresAt, now)}</span></article>)}</div> : <EmptyState icon="clock" title="Aucune alerte active" message="Les signaux restent soumis aux règles et aux paramètres confirmés." />}</section>
            </div>
          )}

          {activePage === 'matches' && (
            <>
              <PageHeading eyebrow="SUIVI EN DIRECT" title="Matchs suivis" description="Choisissez les rencontres à surveiller selon le flux disponible." action={<span className="count-badge">{trackedMatches.length} suivis</span>} />
              <div className="notice notice-neutral"><span className="notice-icon"><Icon name="clock" size={18} /></span><div><strong>{matchesData?.message ?? 'Le flux sera consulté à l’ouverture de cette page.'}</strong><p>Quota restant : {matchesData?.quotaRemaining ?? 'inconnu'}. Aucun match ne peut être suivi si le fournisseur indique un quota nul.</p></div></div>
              <section className="content-panel matches-panel"><div className="panel-heading"><div><h2>Rencontres disponibles</h2><p>Les données fictives sont identifiées en haut de page.</p></div><button className="secondary-button" type="button" onClick={() => void loadMatches()}>Actualiser</button></div>
                {matchesData?.matches?.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Rencontre</th><th>Compétition</th><th>État</th><th>Score</th><th>Suivi</th><th>Action</th></tr></thead><tbody>{matchesData.matches.map((match) => <tr key={match.providerMatchId}><td>{match.homeTeam} – {match.awayTeam}<small>{match.kickoffAt ? formatDate(match.kickoffAt) : 'Horaire non disponible'}</small></td><td>{match.competition}</td><td>{match.status}{match.minute === null ? '' : ` · ${match.minute}′`}</td><td>{match.homeScore ?? '—'} – {match.awayScore ?? '—'}</td><td>{match.tracked ? 'Suivi' : 'Non suivi'}</td><td><button className="secondary-button compact-button" type="button" disabled={isBusy || (!match.tracked && matchesData.quotaRemaining === 0)} onClick={() => void toggleMatch(match)}>{match.tracked ? 'Retirer' : 'Suivre'}</button></td></tr>)}</tbody></table></div> : <EmptyState icon="search" title="Aucune rencontre disponible" message="Le fournisseur n’a retourné aucun match pour le moment." />}
              </section>
            </>
          )}

          {activePage === 'rules' && (
            <>
              <PageHeading eyebrow="CONFIGURATION" title="Moteur de règles" description="Activez uniquement les règles documentées et configurez les poids validés." action={<span className="phase-badge phase-badge-muted">{ruleProfile?.profile?.name ?? 'Profil à configurer'}</span>} />
              <div className="notice notice-warning"><span className="notice-icon"><Icon name="shield" size={18} /></span><div><strong>Les règles non définies ne déclenchent jamais de signal</strong><p>Les poids de convergence sont laissés vides jusqu’à validation par le client.</p></div></div>
              <section className="content-panel rules-panel"><div className="panel-heading"><div><h2>Règles Phase 1</h2><p>Activation limitée aux règles disponibles dans le moteur.</p></div><span className="count-badge">{ruleDescriptions.length} règles documentées</span></div><div className="rule-table">{ruleDescriptions.map((rule) => <article className="rule-row" key={rule.id}><span className="rule-id">{rule.id}</span><div className="rule-info"><strong>{rule.title}</strong><p>{rule.detail}</p></div><span className={`status-pill ${rule.status === 'Disponible' ? 'status-ready' : rule.status === 'Partiel' ? 'status-partial' : 'status-pending'}`}>{rule.status}</span></article>)}</div></section>
              <form className="content-panel settings-form" onSubmit={saveRuleProfile}><div className="panel-heading"><div><h2>Profil actif</h2><p>Les poids laissés vides ne sont pas ajoutés au profil.</p></div></div>
                <fieldset className="rule-selection"><legend>Règles activées</legend>{(ruleProfile?.availableRules ?? []).map((rule) => <label className="check-row" key={rule}><input type="checkbox" checked={profileDraft.activeRules.includes(rule)} onChange={(event) => setProfileDraft((previous) => ({ ...previous, activeRules: event.target.checked ? [...previous.activeRules, rule] : previous.activeRules.filter((item) => item !== rule) }))} />{rule}</label>)}</fieldset>
                <div className="field-grid">{(ruleProfile?.availableRules ?? []).map((rule) => <label key={rule}>Poids méthode — {rule}<input min="0" step="0.01" type="number" value={profileDraft.methodWeights[rule] ?? ''} onChange={(event) => setProfileDraft((previous) => ({ ...previous, methodWeights: { ...previous.methodWeights, [rule]: event.target.value } }))} placeholder="À confirmer" /></label>)}</div>
                <button className="primary-button" type="submit" disabled={isBusy}>Enregistrer le profil</button>
              </form>
            </>
          )}

          {activePage === 'tester' && (
            <>
              <PageHeading eyebrow="VALIDATION" title="Testeur manuel" description="Évalue un jeu de cotes fourni, sans envoyer de signal ni placer de pari." action={<span className="phase-badge phase-badge-muted"><Icon name="flask" size={15} /> Simulation uniquement</span>} />
              <div className="notice notice-neutral"><span className="notice-icon"><Icon name="shield" size={18} /></span><div><strong>Les résultats affichés sont une simulation locale</strong><p>Aucun message n’est envoyé. La tendance reste abstentionniste tant que sa source et son seuil ne sont pas confirmés.</p></div></div>
              <div className="tester-layout">
                <section className="content-panel tester-panel"><div className="panel-heading"><div><h2>Situation du match</h2><p>Saisissez les données du scénario à évaluer.</p></div><span className="manual-tag">F125</span></div>
                  <form className="tester-form" onSubmit={testRules}>
                    <div className="form-row"><label>Score à domicile<input min="0" max="20" type="number" value={testFields.homeScore} onChange={updateTestField('homeScore')} required /></label><span className="score-separator">–</span><label>Score à l’extérieur<input min="0" max="20" type="number" value={testFields.awayScore} onChange={updateTestField('awayScore')} required /></label></div>
                    <label>Cotes des scores exacts <span className="label-note">une ligne par score</span><textarea rows="5" spellCheck="false" value={testFields.oddsText} onChange={updateTestField('oddsText')} placeholder={'0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80'} required /></label>
                    <div className="form-row form-row-wide"><label>Vitalité (0–100)<input min="0" max="100" step="0.1" type="number" value={testFields.vitalityScore} onChange={updateTestField('vitalityScore')} required /></label><label>Variation des cotes sur 2 min (%)<input step="0.1" type="number" value={testFields.oddsChangePercent} onChange={updateTestField('oddsChangePercent')} required /><span className="field-help">Valeur négative = cotes en baisse.</span></label></div>
                    <div className="field-grid"><label>Source de tendance<select value={testFields.tendanceSource} onChange={updateTestField('tendanceSource')}><option value="">Non confirmée</option><option value="cote_suggeree">Cote suggérée (hypothèse)</option></select></label><label>Seuil stable (%)<input min="0" step="0.1" type="number" value={testFields.tendanceSeuilStable} onChange={updateTestField('tendanceSeuilStable')} placeholder="À confirmer" /></label></div>
                    <p className="format-hint">Format accepté : <code>score = cote</code> ou <code>score : cote</code>. Les paramètres de tendance ne s’appliquent qu’à cette simulation.</p>
                    {testError && <div className="form-error" role="alert">{testError}</div>}
                    <button className="primary-button" type="submit" disabled={isTesting}>{isTesting ? 'Évaluation…' : 'Évaluer la situation'} <Icon name="arrow" size={17} /></button>
                  </form>
                </section>
                <section className="content-panel result-panel" aria-live="polite"><div className="panel-heading"><div><h2>Résultat de la simulation</h2><p>Analyse des règles et des filtres</p></div></div>{testResult ? <SimulationResult result={testResult} /> : <EmptyState icon="flask" title="Prêt à tester" message="Les résultats apparaîtront ici après l’évaluation des données saisies." />}</section>
              </div>
            </>
          )}

          {activePage === 'journal' && (
            <>
              <PageHeading eyebrow="HISTORIQUE" title="Journal des opportunités" description="Consultez les évaluations, décisions, filtres et résultats associés." />
              <section className="content-panel"><form className="filter-toolbar" onSubmit={(event) => { event.preventDefault(); void loadJournal(journalFilters) }}><label>Du<input type="date" value={journalFilters.date_from} onChange={(event) => setJournalFilters((previous) => ({ ...previous, date_from: event.target.value }))} /></label><label>Au<input type="date" value={journalFilters.date_to} onChange={(event) => setJournalFilters((previous) => ({ ...previous, date_to: event.target.value }))} /></label><label>ID du match<input min="1" type="number" value={journalFilters.match_id} onChange={(event) => setJournalFilters((previous) => ({ ...previous, match_id: event.target.value }))} /></label><label>Règle<input value={journalFilters.rule_id} onChange={(event) => setJournalFilters((previous) => ({ ...previous, rule_id: event.target.value }))} placeholder="F121-C" /></label><label>État<select value={journalFilters.status} onChange={(event) => setJournalFilters((previous) => ({ ...previous, status: event.target.value }))}><option value="">Tous</option><option value="sans_alerte">Sans alerte</option><option value="queued">En attente</option><option value="sent">Envoyée</option><option value="failed">Échec</option><option value="expired">Expirée</option><option value="invalidated">Invalidée</option></select></label><button className="secondary-button" type="submit"><Icon name="search" size={16} /> Filtrer</button></form>
                <div className="panel-heading"><div><h2>Événements récents</h2><p>{journalData?.pagination?.total ?? 0} événement(s)</p></div></div>
                {journalData?.data?.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Date</th><th>Rencontre</th><th>Score / minute</th><th>Règle</th><th>Décision</th><th>Justification</th><th>Résultat</th></tr></thead><tbody>{journalData.data.map((log) => <tr key={log.id}><td>{formatDate(log.evaluatedAt)}</td><td>{log.match ?? '—'}</td><td>{log.score ?? '—'}{log.minute === null ? '' : ` · ${log.minute}′`}</td><td>{log.ruleId ?? '—'}</td><td>{log.decision}</td><td>{log.reason}</td><td>{log.alert ? <select aria-label={`Résultat de l’alerte ${log.id}`} value={log.outcome ?? ''} onChange={(event) => void updateOutcome(log.id, event.target.value)}><option value="">À renseigner</option><option value="won">Gagnée</option><option value="lost">Perdue</option><option value="cancelled">Annulée</option></select> : '—'}</td></tr>)}</tbody></table></div> : <EmptyState icon="list" title="Aucun événement" message="Aucune évaluation ne correspond aux critères choisis." />}
                {journalData?.pagination?.lastPage > 1 && <div className="pagination"><button className="secondary-button" type="button" disabled={journalData.pagination.currentPage <= 1} onClick={() => void loadJournal({ ...journalFilters, page: String(journalData.pagination.currentPage - 1) })}>Précédent</button><span>Page {journalData.pagination.currentPage} / {journalData.pagination.lastPage}</span><button className="secondary-button" type="button" disabled={journalData.pagination.currentPage >= journalData.pagination.lastPage} onClick={() => void loadJournal({ ...journalFilters, page: String(journalData.pagination.currentPage + 1) })}>Suivant</button></div>}
              </section>
            </>
          )}

          {activePage === 'statistics' && (
            <>
              <PageHeading eyebrow="ANALYSE" title="Statistiques" description="Indicateurs calculés à partir des alertes et résultats enregistrés." />
              <section className="content-panel"><form className="filter-toolbar" onSubmit={(event) => { event.preventDefault(); void loadStatistics(statisticsFilters) }}><label>Du<input type="date" value={statisticsFilters.date_from} onChange={(event) => setStatisticsFilters((previous) => ({ ...previous, date_from: event.target.value }))} /></label><label>Au<input type="date" value={statisticsFilters.date_to} onChange={(event) => setStatisticsFilters((previous) => ({ ...previous, date_to: event.target.value }))} /></label><button className="secondary-button" type="submit"><Icon name="search" size={16} /> Appliquer</button></form>
                <div className="stats-grid">{[['Alertes', statistics?.alerts?.total], ['Actives', statistics?.alerts?.active], ['Gagnées', statistics?.alerts?.won], ['Perdues', statistics?.alerts?.lost], ['Annulées', statistics?.alerts?.cancelled], ['Sans résultat', statistics?.alerts?.unrated], ['Taux de réussite', statistics?.alerts?.successRatePercent === null || statistics?.alerts?.successRatePercent === undefined ? '—' : `${statistics.alerts.successRatePercent} %`]].map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value ?? '—'}</strong></article>)}</div>
                <div className="panel-heading"><div><h2>Résultats par règle</h2></div></div>
                {statistics?.byRule && Object.keys(statistics.byRule).length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Règle</th><th>Alertes</th><th>Gagnées</th><th>Perdues</th><th>Annulées</th><th>Taux</th></tr></thead><tbody>{Object.entries(statistics.byRule).map(([rule, data]) => <tr key={rule}><td>{rule}</td><td>{data.alerts}</td><td>{data.won}</td><td>{data.lost}</td><td>{data.cancelled}</td><td>{data.successRatePercent === null ? '—' : `${data.successRatePercent} %`}</td></tr>)}</tbody></table></div> : <EmptyState icon="chart" title="Pas encore de résultats" message="Les statistiques apparaîtront lorsque des alertes et leurs résultats seront consignés." />}
                {statistics?.refusalsByFilter && Object.keys(statistics.refusalsByFilter).length > 0 && <div className="panel-heading"><div><h2>Refus par filtre</h2></div></div>}
                {statistics?.refusalsByFilter && Object.entries(statistics.refusalsByFilter).map(([filter, count]) => <div className="simulation-line" key={filter}><span>{filter}</span><strong>{count}</strong></div>)}
              </section>
            </>
          )}

          {activePage === 'settings' && (
            <>
              <PageHeading eyebrow="CONFIGURATION" title="Paramètres" description="Modifiez les paramètres enregistrés et consultez leur historique." action={<button className="secondary-button" type="button" onClick={() => void runNotificationTest()} disabled={isBusy}>Tester les notifications</button>} />
              <div className="notice notice-warning"><span className="notice-icon"><Icon name="shield" size={18} /></span><div><strong>Les paramètres à confirmer sont laissés vides</strong><p>La tendance reste abstentionniste tant que les confirmations client ne sont pas renseignées. Aucun pari automatique n’est effectué.</p></div></div>
              <form className="content-panel settings-form" onSubmit={saveSettings}><div className="panel-heading"><div><h2>Paramètres du détecteur</h2><p>Les champs sans valeur ne déclenchent pas de comportement supposé.</p></div></div>
                {settings.length ? <div className="settings-list">{settings.map((setting) => <label className="setting-row" key={setting.key}><span><strong>{settingLabels[setting.key] ?? setting.key}</strong><small>{settingDescriptions[setting.key] ?? 'Paramètre utilisé par le détecteur.'}{setting.needsConfirmation ? ' · À confirmer' : ''}</small></span>{setting.type === 'boolean' ? <input type="checkbox" checked={settingsDraft[setting.key] === true} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.checked }))} /> : setting.type === 'json' ? <textarea rows="3" value={settingsDraft[setting.key] ?? ''} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))} placeholder="À confirmer" /> : setting.key === 'tendance_source' ? <select value={settingsDraft[setting.key] ?? ''} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))}><option value="">À confirmer</option><option value="cote_suggeree">Cote suggérée (hypothèse)</option></select> : <input type={setting.type === 'integer' || setting.type === 'decimal' ? 'number' : 'text'} min={setting.type === 'integer' || setting.type === 'decimal' ? '0' : undefined} step={setting.type === 'decimal' ? '0.01' : undefined} value={settingsDraft[setting.key] ?? ''} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))} placeholder={setting.needsConfirmation ? 'À confirmer' : ''} />}</label>)}</div> : <EmptyState icon="settings" title="Paramètres indisponibles" message="Aucun paramètre enregistré n’a été retourné." />}
                <div className="form-actions"><button className="primary-button" type="submit" disabled={isBusy || !settings.length}>Enregistrer</button><button className="secondary-button" type="button" onClick={() => void resetSettings()} disabled={isBusy}>Réinitialiser</button></div>
              </form>
              <section className="content-panel"><div className="panel-heading"><div><h2>Historique des modifications</h2><p>Les dernières modifications de paramètres sont conservées.</p></div></div>{settingsHistory.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Date</th><th>Paramètre</th><th>Ancienne valeur</th><th>Nouvelle valeur</th><th>Administrateur</th></tr></thead><tbody>{settingsHistory.map((change) => <tr key={change.id}><td>{formatDate(change.changedAt)}</td><td>{settingLabels[change.settingKey] ?? change.settingKey}</td><td>{change.oldValue ?? '—'}</td><td>{change.newValue ?? '—'}</td><td>{change.user}</td></tr>)}</tbody></table></div> : <EmptyState icon="list" title="Aucun changement" message="L’historique se remplira après la première modification." />}</section>
            </>
          )}
        </div>
        <footer className="footer"><span>PRONOFOOT · Phase 1</span><span>Détecteur live réservé à l’administration · aucun pari automatique</span></footer>
      </main>
    </div>
  )
}

export default App
