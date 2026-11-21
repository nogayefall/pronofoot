import { Fragment, useEffect, useRef, useState } from 'react'
import { createRuleTestPayload, requestAdminApi, teamStatisticsRows, journalDecisionLabel, parseAlertMessage, trackedMatchDecision, quotaSummary, elapsedLabel, scanModeLabel, upcomingMatchesView, statisticsOptionRows, OPTION_DECISIONS, OPTION_OUTCOMES, matchStatusLabel, unavailableReason, availableMatchesView, leagueFilters, leagueFilterCounts, leagueFilterFromUrl, effectiveLeagueFilter, leagueChosenInUrl, DEFAULT_TRACKED_LEAGUE_IDS } from './adminData'
import { AlertCard, AlertOptionsEditor, Brand, ReasonText, EmptyState, Icon, MetricCard, Pill, ScanModeControl, Section, VitalityBar } from './ui'
import './App.css'

const navigation = [
  { id: 'overview', label: 'Tableau de bord', icon: 'grid' },
  { id: 'matches', label: 'Matchs suivis', icon: 'target' },
  { id: 'rules', label: 'Moteur de règles', icon: 'sliders' },
  { id: 'tester', label: 'Testeur manuel', icon: 'flask' },
  { id: 'journal', label: 'Journal des décisions', icon: 'list' },
  { id: 'statistics', label: 'Statistiques', icon: 'chart' },
  { id: 'settings', label: 'Paramètres', icon: 'settings' },
]

const providerLabels = { api_football: 'API-Football', real: 'API-Football', the_odds_api: 'The Odds API', fake: 'pilote fictif' }

const journalTones = { alert: 'alert', duplicate_suppressed: 'watch', reevaluate: 'high', invalidated: 'dead', expired: 'dead' }

const MATCHES_PAGE_SIZE = 15

function formatTime(value) {
  return value ? new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join('') || 'A'
}

function plural(count, word) {
  return `${count} ${word}${count > 1 ? 's' : ''}`
}

const ruleDescriptions = [
  { id: 'F121-C', title: 'Écart des deux équipes', status: 'Disponible', detail: 'Pour chaque équipe : écart = cote du score de son prochain but − cote du score actuel, et tendance de cette cote. Les deux équipes sont évaluées ; la plus forte alerte l’emporte (critique, puis écart le plus négatif, puis baisse la plus forte, à confirmer).' },
  { id: 'F121-C.2', title: 'Avantage de deux buts', status: 'Disponible', detail: 'Indicatif : ne désigne plus l’équipe, puisque les deux équipes sont évaluées.' },
  { id: 'F121-D', title: 'Match ouvert', status: 'Disponible', detail: 'Au moins 4 buts (à confirmer) et cotes des scores suivants ≤ 8.00 : Over 4.5.' },
  { id: 'F162-Bis', title: 'Baisse obligatoire', status: 'Disponible', detail: 'Cote du prochain but en baisse de plus de 5 % en 2 minutes : alerte critique, prioritaire sur l’écart.' },
  { id: 'F121-E1', title: 'Écart négatif', status: 'Disponible', detail: 'Cote du prochain but inférieure à celle du score actuel : alerte critique.' },
  { id: 'F121-G', title: 'Filtre d’abstention', status: 'Disponible', detail: 'Écart positif au-delà de 0.50 sans forte baisse : abstention. Entre 0 et 0.50 : alerte haute.' },
  { id: 'F121-E2', title: 'Signal mi-temps', status: 'Disponible', detail: 'Under 2.5 (total du match, pari API-Football 36) entre 1.15 et 1.40 à la mi-temps : Over 0.5 en 2e mi-temps.' },
  { id: 'F121-K · T · X', title: 'Écarts et tendance', status: 'Non défini', detail: 'La formule exacte doit être fournie avant activation.' },
  { id: 'F122 · F124 · F126', title: 'Règles complémentaires', status: 'Non défini', detail: 'Formules métier à confirmer par le client.' },
]

const settingLabels = {
  'scan.odds_interval_seconds': 'Fréquence de lecture des cotes (secondes)',
  'scan.statistics_interval_seconds': 'Fréquence des statistiques (secondes)',
  'scan.goal_interval_seconds': 'Fréquence de détection de but (secondes)',
  'scan.goal_window_seconds': 'Fenêtre de relance après un but (secondes)',
  'alerts.expiration_minutes': 'Expiration des alertes (minutes)',
  'rules.maximum_directional_gap': 'F121-A : écart maximal (inactif)',
  'rules.zero_zero_odds_wait_threshold': 'Règle 0–0 : seuil de cote (inactif)',
  'rules.zero_zero_gap_threshold': 'Règle 0–0 : seuil d’écart (inactif)',
  'rules.upcoming_score_odds_limit': 'Limite de cote des scores suivants',
  'rules.minimum_vitality': 'Vitalité minimale',
  'rules.minimum_convergence_score': 'Convergence minimale',
  'tendance_source': 'Source de tendance',
  'tendance_seuil_stable': 'Seuil de baisse de la tendance (%)',
  'rules.vitality_normalization_references': 'Barème de la vitalité',
  'rules.halftime_under25_min': 'F121-E2 : Under 2.5 minimal',
  'rules.halftime_under25_max': 'F121-E2 : Under 2.5 maximal',
  'rules.open_match_min_goals': 'F121-D : nombre minimal de buts (à confirmer)',
  'rules.abstention_gap_threshold': 'F121-G : seuil d’écart d’abstention',
  'rules.minutes_remaining_enabled': 'Abstention s’il reste peu de minutes (à confirmer)',
  'rules.minutes_remaining_min': 'Minutes de jeu restantes minimales (à confirmer)',
  'alerts.level_negative_gap': 'Niveau d’alerte : écart négatif',
  'alerts.level_positive_gap': 'Niveau d’alerte : écart sous le seuil',
  'rules.decision_pipeline': 'Ordre de décision (à confirmer)',
  'rules.convergence_enabled': 'Étape « convergence » (score de confiance)',
  'scan.quota_economy_percent': 'Seuil d’alerte et mode économie du quota (%)',
  'scan.hot_interval_seconds': 'Fréquence des matchs chauds (secondes)',
  'scan.calm_interval_seconds': 'Fréquence des matchs calmes (secondes)',
  'scan.hot_gap_threshold': 'Écart d’un match chaud (à confirmer)',
  'scan.no_scan_gap_threshold': 'Écart au-delà duquel un match n’est pas scanné (à confirmer)',
  'scan.auto_mode': 'Mode de scan automatique (sinon manuel)',
  'scan.auto_league_ids': 'Ligues suivies automatiquement (identifiants API-Football)',
  'scan.missing_readings_before_end': 'Relevés absents du flux avant la fin d’un match',
  'scan.max_match_duration_minutes': 'Durée maximale de suivi d’un match (minutes)',
  'scan.idle_interval_seconds': 'Pause sans match à suivre (secondes, à confirmer)',
  'scan.allow_tracking_without_statistics': 'Autoriser le suivi sans statistiques',
  'results.bet_validity': 'Validité du pari pour le résultat automatique',
  'results.count_extra_time': 'Compter la prolongation dans le résultat automatique',
  'scan.paused': 'Scan en pause',
  'rules.f121x_enabled': 'F121-X : pari neutre sur écart croisé (à confirmer)',
  'rules.f121x_cross_gap_max': 'F121-X : écart croisé maximal (à confirmer)',
  'rules.follow_leader_enabled': 'F121-C.2 : suivre l’équipe qui mène de 2 buts (à confirmer)',
}

const settingDescriptions = {
  'scan.odds_interval_seconds': 'Fréquence de mise à jour des cotes.',
  'scan.statistics_interval_seconds': 'Fréquence de mise à jour des statistiques.',
  'scan.goal_interval_seconds': 'Fréquence de vérification après un but.',
  'scan.goal_window_seconds': 'Durée de la vérification accélérée après un but.',
  'alerts.expiration_minutes': 'Durée avant qu’une alerte expire.',
  'rules.maximum_directional_gap': 'N’intervient plus dans l’ordre de décision du complément 2 ; conservé comme paramètre.',
  'rules.zero_zero_odds_wait_threshold': 'N’intervient plus dans l’ordre de décision du complément 2 ; conservé comme paramètre.',
  'rules.zero_zero_gap_threshold': 'N’intervient plus dans l’ordre de décision du complément 2 ; conservé comme paramètre.',
  'rules.upcoming_score_odds_limit': 'Limite de cote pour les scores suivants.',
  'rules.minimum_vitality': 'Niveau minimal de vitalité requis.',
  'rules.minimum_convergence_score': 'Niveau minimal de convergence requis.',
  tendance_source: 'Valeur de cote utilisée pour calculer la tendance.',
  tendance_seuil_stable: 'Baisse de plus de ce pourcentage : alerte critique (F162-Bis). Une hausse donne une abstention.',
  'rules.vitality_normalization_references': 'Paliers [minimum inclus, points] par statistique, totaux des deux équipes.',
  'rules.halftime_under25_min': 'Borne basse incluse de la cote Under 2.5 à la mi-temps.',
  'rules.halftime_under25_max': 'Borne haute incluse de la cote Under 2.5 à la mi-temps.',
  'rules.open_match_min_goals': 'Total de buts à partir duquel le score est « élevé » pour F121-D.',
  'rules.abstention_gap_threshold': 'Au-delà, abstention (F121-G) ; entre 0 exclu et ce seuil inclus, alerte haute.',
  'rules.minutes_remaining_enabled': 'Règle hors pseudo-code du client, désactivée par défaut.',
  'rules.minutes_remaining_min': 'Abstention s’il reste moins de ces minutes sur 90.',
  'alerts.level_negative_gap': 'Libellé d’une alerte F121-E1.',
  'alerts.level_positive_gap': 'Libellé d’une alerte sur écart positif inférieur au seuil.',
  'rules.decision_pipeline': 'Étapes : F121-E2, F121-D, designation, vitality, trend, gap. La convergence s’active avec le paramètre dédié.',
  'rules.convergence_enabled': 'Désactivée par défaut. Activée : alerte seulement si le score de confiance dépasse le seuil du profil. Poids et scores à confirmer.',
  'scan.quota_economy_percent': 'Pourcentage du quota journalier restant qui déclenche l’alerte et le mode économie.',
  'scan.hot_interval_seconds': 'En permanence. Match chaud : écart sous le seuil, ou baisse de la cote suggérée de plus de 5 % (seuil de tendance).',
  'scan.calm_interval_seconds': 'En permanence, hors mode économie (où seuls les matchs chauds sont scannés).',
  'scan.hot_gap_threshold': 'Écart sous lequel un match est chaud.',
  'scan.no_scan_gap_threshold': 'Au-delà de cet écart, le match n’est jamais scanné.',
  'scan.auto_mode': 'Suit tous les matchs des ligues listées ayant les cotes de score exact et les statistiques, en plus du Scan Ciblé.',
  'scan.auto_league_ids': 'Par défaut : Premier League 39, Liga 140, Serie A 135, Bundesliga 78, Ligue 1 61, Ligue des champions 2, Europa League 3.',
  'scan.missing_readings_before_end': 'Filet de sécurité : un match absent du flux en direct pendant ce nombre de relevés consécutifs est considéré terminé (4 ≈ 2 minutes).',
  'scan.max_match_duration_minutes': 'Un match dont le coup d’envoi date de plus de ce nombre de minutes est retiré du suivi (270 = 4 h 30).',
  'results.bet_validity': 'Confirmé par le client : fin du match (un but marqué jusqu’au coup de sifflet final compte ; les 15 minutes ne concernent que l’expiration de l’alerte). Durée de l’alerte : seuls les buts marqués avant son expiration comptent (options ciblée et neutre).',
  'results.count_extra_time': 'Confirmé par le client (activé) : les buts de la prolongation comptent comme ceux du temps réglementaire (sauf pour Over 0.5 en 2e mi-temps). Désactivé : seul le temps réglementaire compte.',
  'scan.allow_tracking_without_statistics': 'Permet de suivre un match dont la ligue ne couvre pas les statistiques, si ses cotes de score exact sont disponibles : aucun appel de statistiques, vitalité non disponible et filtre vitalité non appliqué (à confirmer).',
  'scan.paused': 'Aucun appel API tant que le scan est en pause. Se règle aussi avec le bouton Pause / Reprendre.',
  'rules.f121x_enabled': '|écart domicile − écart extérieur| sous le seuil dans un match ouvert : pari neutre « un but de plus ». Désactivée par défaut.',
  'rules.f121x_cross_gap_max': 'Seuil de l’écart croisé pour F121-X.',
  'rules.follow_leader_enabled': 'Si une équipe mène de 2 buts ou plus, seule cette équipe est évaluée. Désactivée par défaut.',
  'scan.idle_interval_seconds': 'Quand aucun match n’est suivi et qu’aucun match des championnats suivis n’est en direct : pas de statistiques ni de cotes, et le flux n’est relu qu’après cette pause.',
}

const decisionStepLabels = {
  'F121-E2': 'Signal mi-temps (F121-E2)',
  'F121-D': 'Match ouvert (F121-D)',
  minutes_remaining: 'Minutes restantes (facultatif)',
  trend_drop: 'Forte baisse (F162-Bis)',
  trend_rise: 'Hausse de la cote',
  gap_negative: 'Écart négatif (F121-E1)',
  gap_too_high: 'Écart trop grand (F121-G)',
  gap_small: 'Petit écart (alerte haute)',
  fin: 'Fin de l’ordre de décision',
  post_goal: 'Après un but',
  post_goal_first_reading: 'Premier relevé après un but',
  post_goal_window: 'Fenêtre après un but (2 min)',
  vitality: 'Vitalité',
  convergence: 'Convergence',
}

const decisionOutcomeLabels = {
  alert: 'Alerte',
  proposal: 'Alerte proposée',
  continue: 'Validé',
  non_applicable: 'Non applicable',
  abstention: 'Abstention',
}

function SimulationResult({ result }) {
  const decision = result.decision
  const direction = result.rules['F121-C']?.details?.selectedTeam
  const directionLabel = direction === 'home' ? 'Équipe à domicile' : direction === 'away' ? 'Équipe à l’extérieur' : 'Direction indéterminée'

  return (
    <div className="simulation-result">
      <div className={`simulation-verdict ${decision.shouldAlert ? 'verdict-alert' : 'verdict-neutral'}`}>
        <span className="verdict-mark">{decision.shouldAlert ? '✓' : '—'}</span>
        <div><strong>{decision.shouldAlert ? `Alerte ${decision.level} théorique — ${decision.rule}` : 'Abstention'}</strong><p>{decision.shouldAlert ? `${decision.suggestedAction}${decision.selection ? ` : ${decision.selection === 'home' ? 'équipe à domicile' : 'équipe à l’extérieur'}` : ''}. ` : ''}{decision.reason}</p></div>
      </div>
      {decision.steps?.length > 0 && <div className="simulation-section"><h3>Ordre de décision (à confirmer)</h3>
        {decision.steps.map((step) => (
          <div className="simulation-line" key={`${step.side ?? 'match'}-${step.step}`}><span>{decisionStepLabels[step.step] ?? step.step}{step.side ? ` — ${step.side === 'home' ? 'domicile' : 'extérieur'}` : ''}</span><strong>{decisionOutcomeLabels[step.outcome] ?? step.outcome}</strong></div>
        ))}
      </div>}
      {decision.options?.length > 0 && <div className="simulation-section"><h3>Options proposées (aucune n’est jouée automatiquement)</h3>
        {decision.options.map((option, index) => (
          <div className="simulation-line" key={`${option.type}-${index}`}><span>{option.type === 'neutral' ? `Neutre : un but de plus dans le match (${option.line})` : `Ciblée : ${option.label.toLowerCase()} (score ${option.scoreKey})`}</span><strong>{option.odds ? `cote ${option.odds.toFixed(2)}` : 'cote non disponible'}</strong></div>
        ))}
      </div>}
      {decision.sides?.length > 0 && <div className="simulation-section"><h3>Deux équipes (règle F121)</h3>
        {decision.sides.map((side) => (
          <div className="simulation-line" key={side.side}><span>{side.side === 'home' ? 'Domicile' : 'Extérieur'} ({side.scoreKey ?? '?'}) · cote {side.nextOdds ?? 'n.c.'} · écart {side.gap === null || side.gap === undefined ? 'n.c.' : `${side.gap > 0 ? '+' : ''}${side.gap.toFixed(2)}`} · tendance {side.change === null || side.change === undefined ? 'n.c.' : `${side.change > 0 ? '+' : ''}${Math.round(side.change * 10) / 10} %`}</span><strong>{side.alert ? `Alerte ${side.level}` : 'Abstention'}</strong></div>
        ))}
      </div>}
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
      <div className="simulation-line"><span>Score de confiance</span><strong>{decision.convergenceScore === null || decision.convergenceScore === undefined ? 'Non calculé (poids ou scores des méthodes manquants)' : `${Math.round(decision.convergenceScore * 10) / 10} %${decision.validationThreshold !== undefined ? ` — seuil ${decision.validationThreshold} % ${decision.convergencePasses ? 'dépassé' : 'non atteint'}${decision.convergenceStep ? '' : ' (étape convergence désactivée)'}` : ''}`}</strong></div>
      <div className="simulation-disclaimer"><Icon name="shield" size={17} /><span>Simulation uniquement : aucune alerte n’est transmise.</span></div>
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
  const [activePage, setActivePage] = useState(() => (new URLSearchParams(window.location.search).has('ligue') ? 'matches' : 'overview'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const burgerRef = useRef(null)
  const drawerCloseRef = useRef(null)
  const drawerWasOpen = useRef(false)
  const [dashboard, setDashboard] = useState(null)
  const [matchesData, setMatchesData] = useState(null)
  const [settings, setSettings] = useState([])
  const [settingsDraft, setSettingsDraft] = useState({})
  const [settingsHistory, setSettingsHistory] = useState([])
  const [ruleProfile, setRuleProfile] = useState(null)
  const [profileDraft, setProfileDraft] = useState({ id: null, activeRules: [], methodWeights: {}, validationThreshold: '' })
  const [newProfileName, setNewProfileName] = useState('')
  const [combinationScores, setCombinationScores] = useState({})
  const [combinationResult, setCombinationResult] = useState(null)
  const [combinationError, setCombinationError] = useState('')
  const [journalData, setJournalData] = useState(null)
  const [journalFilters, setJournalFilters] = useState({ date_from: '', date_to: '', match_id: '', rule_id: '', status: '' })
  const [statistics, setStatistics] = useState(null)
  const [statisticsFilters, setStatisticsFilters] = useState({ date_from: '', date_to: '' })
  const [apiError, setApiError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [notificationTest, setNotificationTest] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [now, setNow] = useState(0)
  const [testFields, setTestFields] = useState({
    homeScore: '0',
    awayScore: '0',
    oddsText: '0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80',
    vitalityScore: '61',
    oddsChangePercent: '-6',
    tendanceSource: 'cote_suggeree',
    tendanceSeuilStable: '5',
    halftime: false,
    under25Odds: '',
  })
  const [testResult, setTestResult] = useState(null)
  const [matchSearch, setMatchSearch] = useState('')
  const [leagueFilter, setLeagueFilter] = useState(() => leagueFilterFromUrl(window.location.search, leagueFilters(DEFAULT_TRACKED_LEAGUE_IDS)))
  const [leagueChosen, setLeagueChosen] = useState(() => leagueChosenInUrl(window.location.search, leagueFilters(DEFAULT_TRACKED_LEAGUE_IDS)))
  const [visibleMatchCount, setVisibleMatchCount] = useState(MATCHES_PAGE_SIZE)
  const [upcomingData, setUpcomingData] = useState(null)
  const [upcomingError, setUpcomingError] = useState('')
  const [visibleUpcomingCount, setVisibleUpcomingCount] = useState(MATCHES_PAGE_SIZE)
  const [testError, setTestError] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? ''
  const adminName = document.querySelector('[data-admin-name]')?.dataset.adminName || 'Administrateur'

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
    if (!new URLSearchParams(window.location.search).has('ligue')) return undefined
    let active = true
    requestAdminApi('/admin/api/matches', csrfToken)
      .then((result) => {
        if (active) setMatchesData(result)
      })
      .catch((error) => {
        if (active) setApiError(error.message)
      })
    requestAdminApi('/admin/api/matches/upcoming', csrfToken)
      .then((result) => {
        if (active) setUpcomingData(result)
      })
      .catch((error) => {
        if (active) setApiError(error.message)
      })

    return () => { active = false }
  }, [csrfToken])

  useEffect(() => {
    if (!mobileMenuOpen) {
      if (drawerWasOpen.current) burgerRef.current?.focus()
      drawerWasOpen.current = false
      return undefined
    }

    drawerWasOpen.current = true
    drawerCloseRef.current?.focus()
    document.body.classList.add('drawer-open')
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.classList.remove('drawer-open')
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (activePage !== 'matches') return
    // Ramène la pastille active dans la rangée (défilement horizontal seulement, la page ne bouge pas).
    const chip = document.querySelector('.league-chip[aria-pressed="true"]')
    const row = chip?.parentElement
    if (chip && row && row.scrollWidth > row.clientWidth) row.scrollLeft = chip.offsetLeft - row.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2
  }, [activePage, leagueFilter, leagueChosen, matchesData])

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

  function profileToDraft(profile) {
    return {
      id: profile?.id ?? null,
      activeRules: profile?.activeRules ?? [],
      methodWeights: profile?.methodWeights ?? {},
      validationThreshold: profile?.validationThreshold ?? '',
    }
  }

  async function loadRuleProfile(selectedId = profileDraft.id) {
    const result = await adminRequest('/admin/api/rule-profile')
    if (result) {
      setRuleProfile(result)
      const selected = result.profiles?.find((profile) => profile.id === selectedId) ?? result.profile ?? result.profiles?.[0]
      setProfileDraft(profileToDraft(selected))
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

  function syncLeagueInUrl(page, league, chosen) {
    const url = new URL(window.location.href)
    if (page === 'matches') url.searchParams.set('ligue', chosen ? league : 'auto')
    else url.searchParams.delete('ligue')
    window.history.replaceState(null, '', url)
  }

  function chooseLeague(league) {
    setLeagueFilter(league)
    setLeagueChosen(true)
    setVisibleMatchCount(MATCHES_PAGE_SIZE)
    syncLeagueInUrl('matches', league, true)
  }

  function selectPage(page) {
    setActivePage(page)
    syncLeagueInUrl(page, leagueFilter, leagueChosen)
    setMobileMenuOpen(false)
    setActionMessage('')
    setApiError('')
    setTestResult(null)
    setTestError('')
    if (page === 'overview') void loadDashboard()
    if (page === 'matches') {
      void loadMatches()
      void loadUpcoming()
    }
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
      const warnings = result.warnings?.length ? ` ${result.warnings.join(' ')}` : ''
      setActionMessage(match.tracked ? 'Rencontre retirée du suivi.' : `Rencontre ajoutée au suivi.${warnings}`)
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
    const body = {
      active_rules: profileDraft.activeRules,
      method_weights: methodWeights,
      validation_threshold: profileDraft.validationThreshold === '' ? null : Number(profileDraft.validationThreshold),
    }
    const result = profileDraft.id
      ? await adminRequest(`/admin/api/rule-profiles/${profileDraft.id}`, 'PUT', body)
      : await adminRequest('/admin/api/rule-profile', 'PUT', body)
    if (result) {
      setActionMessage('Profil de règles sauvegardé.')
      await loadRuleProfile(profileDraft.id)
    }
    setIsBusy(false)
  }

  async function createRuleProfile() {
    if (newProfileName.trim() === '') return
    setIsBusy(true)
    const result = await adminRequest('/admin/api/rule-profiles', 'POST', { name: newProfileName.trim() })
    if (result) {
      setNewProfileName('')
      setActionMessage(`Profil « ${result.created.name} » créé. Les règles par défaut sont cochées ; les poids restent vides tant qu’ils ne sont pas confirmés.`)
      await loadRuleProfile(result.created.id)
    }
    setIsBusy(false)
  }

  async function activateRuleProfile() {
    if (!profileDraft.id) return
    setIsBusy(true)
    const result = await adminRequest(`/admin/api/rule-profiles/${profileDraft.id}/activate`, 'POST', {})
    if (result) {
      setActionMessage('Profil activé : il sera utilisé au prochain passage du scan.')
      await loadRuleProfile(profileDraft.id)
    }
    setIsBusy(false)
  }

  async function testCombination() {
    setCombinationError('')
    setCombinationResult(null)
    try {
      const methodScores = Object.fromEntries(Object.entries(combinationScores)
        .filter(([, score]) => score !== '' && score !== null)
        .map(([rule, score]) => [rule, Number(score)]))
      const payload = { ...createRuleTestPayload(testFields), rule_profile_id: profileDraft.id, method_scores: methodScores }
      setCombinationResult(await requestAdminApi('/admin/rule-test', csrfToken, { method: 'POST', body: payload }))
    } catch (error) {
      setCombinationError(error.message)
    }
  }

  async function loadUpcoming() {
    setUpcomingError('')
    try {
      setUpcomingData(await requestAdminApi('/admin/api/matches/upcoming', csrfToken))
    } catch (error) {
      setUpcomingError(error.message)
    }
  }

  async function toggleSchedule(match) {
    setIsBusy(true)
    const result = match.scheduled
      ? await adminRequest(`/admin/api/matches/${match.trackedId}`, 'DELETE')
      : await adminRequest('/admin/api/matches/scheduled', 'POST', { provider_match_id: match.providerMatchId })
    if (result) {
      setActionMessage(match.scheduled ? 'Suivi planifié annulé.' : `Suivi planifié : ${match.homeTeam} – ${match.awayTeam} démarrera dès le coup d’envoi.`)
      await loadUpcoming()
    }
    setIsBusy(false)
  }

  async function changeScanMode(changes, message) {
    setIsBusy(true)
    const result = await adminRequest('/admin/api/settings', 'PATCH', { settings: changes })
    if (result) {
      await loadSettings()
      await loadDashboard()
      setActionMessage(message)
    }
    setIsBusy(false)
  }

  async function runNotificationTest() {
    setIsBusy(true)
    setNotificationTest(null)
    try {
      const result = await requestAdminApi('/admin/notifications/test', csrfToken, { method: 'POST', body: {} })
      setNotificationTest({ status: result.fallbackUsed || result.simulation ? 'warning' : 'success', text: result.message })
    } catch (error) {
      setNotificationTest({ status: 'error', text: error.message })
    } finally {
      setIsBusy(false)
    }
  }

  async function updateOption(optionId, changes) {
    setIsBusy(true)
    const result = await adminRequest(`/admin/api/alert-options/${optionId}`, 'PATCH', changes)
    if (result) {
      await loadJournal()
      await loadStatistics()
    }
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

  useEffect(() => {
    let active = true
    requestAdminApi('/admin/api/settings', csrfToken)
      .then((result) => {
        if (!active) return
        setSettings(result.settings)
        setSettingsDraft(Object.fromEntries(result.settings.map((setting) => [
          setting.key,
          setting.type === 'json' && setting.value !== null ? JSON.stringify(setting.value, null, 2) : setting.value ?? '',
        ])))
      })
      .catch(() => {})

    return () => { active = false }
  }, [csrfToken])

  const settingValue = (key) => settings.find((setting) => setting.key === key)?.value ?? null
  const minimumVitality = typeof settingValue('rules.minimum_vitality') === 'number' ? settingValue('rules.minimum_vitality') : 41
  const hotInterval = settingValue('scan.hot_interval_seconds')
  const calmInterval = settingValue('scan.calm_interval_seconds')
  const expirationMinutes = settingValue('alerts.expiration_minutes')
  const ruleTitles = Object.fromEntries(ruleDescriptions.map((rule) => [rule.id, rule.title]))
  const parsedAlerts = activeAlerts.map((alert) => ({ alert, matchName: alert.match, parsed: parseAlertMessage(alert.message) }))
  const competitionOf = (matchName) => trackedMatches.find((match) => `${match.homeTeam} - ${match.awayTeam}` === matchName)?.competition ?? null
  const criticalCount = parsedAlerts.filter((item) => item.parsed?.level === 'critical').length
  const competitionCount = new Set(trackedMatches.map((match) => match.competition).filter(Boolean)).size
  const quota = quotaSummary(dashboard?.providerStatus)
  const oddsDriver = dashboard?.providerStatus?.odds?.driver
  const alertChannels = [...new Set(activeAlerts.map((alert) => alert.channel).filter(Boolean))]
  const lastPassAt = dashboard?.scan?.lastPassAt
  const scanActive = dashboard?.scan?.active === true
  const scanMode = dashboard?.scanMode ?? null
  const scanStateLabel = scanModeLabel(scanMode)
  const allowWithoutStatistics = settingValue('scan.allow_tracking_without_statistics') !== false
  const scanModeControl = <ScanModeControl scanMode={scanMode} label={scanStateLabel} busy={isBusy} onMode={(mode) => void changeScanMode({ 'scan.auto_mode': mode === 'auto' }, mode === 'auto' ? 'Mode de scan : automatique. Pris en compte au prochain tour.' : 'Mode de scan : manuel. Pris en compte au prochain tour.')} onPause={(paused) => void changeScanMode({ 'scan.paused': paused }, paused ? 'Scan en pause : aucun appel API à partir du prochain tour.' : 'Scan repris au prochain tour.')} />
  const autoLeagueIds = Array.isArray(settingValue('scan.auto_league_ids')) ? settingValue('scan.auto_league_ids') : null
  const alertMatchNames = activeAlerts.map((alert) => alert.match).filter(Boolean)
  const trackedLeagueIds = autoLeagueIds ?? DEFAULT_TRACKED_LEAGUE_IDS
  const leagueChips = leagueFilters(trackedLeagueIds)
  const leagueCounts = leagueFilterCounts(matchesData?.matches ?? [], leagueChips)
  const shownLeague = effectiveLeagueFilter(leagueFilter, leagueChosen, leagueCounts)
  const autoOpenedOthers = shownLeague !== leagueFilter
  const activeLeague = leagueChips.find((chip) => chip.key === shownLeague) ?? leagueChips[0]
  const matchesView = availableMatchesView(matchesData?.matches ?? [], { leagueIds: trackedLeagueIds, league: activeLeague.key, query: matchSearch, alertMatchNames })
  const upcomingView = upcomingMatchesView(upcomingData?.matches ?? [], { leagueIds: trackedLeagueIds, league: activeLeague.key, query: matchSearch })
  const visibleUpcoming = upcomingView.slice(0, visibleUpcomingCount)
  const scheduleButton = (match) => (match.scheduled
    ? <button className="button button-compact button-ghost" type="button" disabled={isBusy} onClick={() => void toggleSchedule(match)}>Annuler</button>
    : <button className="button button-compact button-secondary" type="button" disabled={isBusy} onClick={() => void toggleSchedule(match)}>Suivre dès le coup d’envoi</button>)
  const visibleMatchRows = matchesView.slice(0, visibleMatchCount).map((match) => ({
    match,
    reason: unavailableReason(match, matchesData?.quotaRemaining, allowWithoutStatistics),
    alerted: alertMatchNames.includes(`${match.homeTeam} - ${match.awayTeam}`),
    statisticsNote: match.statisticsCoverage === null
      ? 'Couverture des statistiques non confirmée par le fournisseur.'
      : match.statisticsCoverageFallback
        ? `Couverture lue sur la saison courante (${match.statisticsCoverageSeason ?? 'année inconnue'}).`
        : undefined,
  }))
  const matchAction = ({ match, reason }, withTooltip) => (match.tracked
    ? <button className="button button-compact button-ghost" type="button" disabled={isBusy} onClick={() => void toggleMatch(match)}>Retirer</button>
    : reason
      ? <button className="button button-compact button-unavailable" type="button" aria-disabled="true" data-tooltip={withTooltip ? reason : undefined} onClick={(event) => event.preventDefault()}>Indisponible<span className="visually-hidden"> : {reason}</span></button>
      : <button className="button button-compact button-primary" type="button" disabled={isBusy} onClick={() => void toggleMatch(match)}>Suivre</button>)

  const pages = {
    overview: {
      title: 'Tableau de bord',
      description: ['Vue d’ensemble du détecteur', dashboard ? (simulation ? 'Mode simulation' : 'Mode réel') : null, oddsDriver ? (providerLabels[oddsDriver] ?? oddsDriver) : null].filter(Boolean).join(' · '),
      action: <><button className="button button-ghost" type="button" onClick={() => void loadDashboard()}><Icon name="refresh" size={16} />Actualiser</button><button className="button button-secondary" type="button" onClick={() => selectPage('matches')}>Scan ciblé</button></>,
    },
    matches: { title: 'Matchs suivis', description: 'Choisissez les rencontres à surveiller selon le flux disponible.', action: <span className="count-badge"><span className="num">{trackedMatches.length}</span> suivis</span> },
    rules: { title: 'Moteur de règles', description: 'Activez uniquement les règles documentées et configurez les poids validés.', action: <Pill tone="watch" dot={false}>{ruleProfile?.profile?.name ?? 'Profil à configurer'}</Pill> },
    tester: { title: 'Testeur manuel', description: 'Évalue un jeu de cotes fourni, sans envoyer de signal ni placer de pari.', action: <Pill tone="watch" dot={false}>Simulation uniquement</Pill> },
    journal: { title: 'Journal des décisions', description: 'Évaluations, décisions, filtres et résultats associés.' },
    statistics: { title: 'Statistiques', description: 'Indicateurs calculés à partir des alertes et résultats enregistrés.' },
    settings: { title: 'Paramètres', description: 'Modifiez les paramètres enregistrés et consultez leur historique.', action: <button className="button button-secondary" type="button" onClick={() => void runNotificationTest()} disabled={isBusy}>Envoyer un message de test</button> },
  }
  const page = pages[activePage] ?? pages.overview

  return (
    <div className="admin-shell">
      <header className="mobile-bar">
        <button ref={burgerRef} className="burger" type="button" aria-label="Ouvrir le menu" aria-expanded={mobileMenuOpen} aria-controls="admin-sidebar" onClick={() => setMobileMenuOpen(true)}><Icon name="menu" size={22} /></button>
        <Brand />
        <span className="avatar avatar-small" title={adminName} aria-label={`Connecté : ${adminName}`} role="img">{initials(adminName)}</span>
      </header>
      {mobileMenuOpen && <div className="drawer-backdrop" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />}
      <aside id="admin-sidebar" className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`} aria-label="Menu principal">
        <div className="sidebar-top">
          <Brand />
          <button ref={drawerCloseRef} className="drawer-close" type="button" aria-label="Fermer le menu" onClick={() => setMobileMenuOpen(false)}><Icon name="close" size={20} /></button>
        </div>
        <nav id="main-navigation" className="navigation" aria-label="Navigation principale">
          {navigation.map((item) => (
            <button className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`} aria-current={activePage === item.id ? 'page' : undefined} key={item.id} onClick={() => selectPage(item.id)} type="button">
              <Icon name={item.icon} size={18} /><span>{item.label}</span>
              {item.id === 'matches' && trackedMatches.length > 0 && <span className="nav-count num">{trackedMatches.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className={`scan-card ${scanActive ? 'scan-card-active' : ''}`} role="status">
          <p className="scan-card-state"><span className="scan-dot" aria-hidden="true" />{dashboard ? (scanMode?.paused ? scanStateLabel : `${scanStateLabel} · ${scanActive ? 'en cours' : 'à l’arrêt'}`) : 'État du scan…'}</p>
          <p className="num scan-card-time">Dernier relevé {elapsedLabel(lastPassAt, now)}</p>
        </div>
        <div className="drawer-account">
          <div className="drawer-account-name"><span className="avatar" aria-hidden="true">{initials(adminName)}</span><span><strong>{adminName}</strong><small>Administrateur</small></span></div>
          <button className="button button-ghost drawer-logout" type="button" onClick={logout}><Icon name="logout" size={16} />Se déconnecter</button>
        </div>
      </aside>

      <main className="main-area">
        <div className="content">
          <header className="page-header">
            <div className="page-title">
              <h1>{page.title}</h1>
              <p>{page.description}</p>
            </div>
            <div className="page-actions">
              {page.action}
              <span className="avatar" title={adminName} aria-label={`Connecté : ${adminName}`} role="img">{initials(adminName)}</span>
              <button className="button button-ghost logout-button" type="button" onClick={logout}><Icon name="logout" size={16} /><span>Se déconnecter</span></button>
            </div>
          </header>
          {logoutError && <p className="message message-error" role="alert">{logoutError}</p>}
          {simulation && <div className="message message-warning" role="status"><Icon name="shield" size={18} /><span><strong>Mode simulation :</strong> les données affichées proviennent d’au moins un pilote fictif.</span></div>}
          {apiError && <div className="message message-error" role="alert">{apiError}</div>}
          {actionMessage && <div className="message message-success" role="status">{actionMessage}</div>}

          {activePage === 'overview' && (
            <>
              {dashboard?.quotaMode === 'exhausted' && <div className="message message-critical" role="alert"><Icon name="shield" size={18} /><strong>Quota épuisé. Le live est arrêté. Rechargez le quota.</strong></div>}
              {dashboard?.quotaMode === 'economy' && <div className="message message-warning" role="status"><Icon name="shield" size={18} /><span><strong>Mode économie du quota :</strong> seuls les matchs chauds sont scannés ; les matchs calmes attendent le retour du quota.</span></div>}

              <div className="metrics-grid">
                <MetricCard label="Matchs suivis" value={trackedMatches.length} unit="suivis" caption={competitionCount ? `${plural(competitionCount, 'championnat')} couvert${competitionCount > 1 ? 's' : ''}` : 'Aucun championnat en cours'} />
                <MetricCard label="Alertes actives" value={activeAlerts.length} tone={activeAlerts.length ? 'accent' : undefined} unit={criticalCount ? `${criticalCount} critique${criticalCount > 1 ? 's' : ''}` : null} caption={alertChannels.length ? `Envoyées sur ${alertChannels.map((channel) => channel === 'telegram' ? 'Telegram' : channel === 'log' ? 'le journal' : channel).join(', ')}` : 'Aucune alerte en cours'} />
                <MetricCard label="Quota API restant" value={quota.remaining === null ? '—' : quota.remaining.toLocaleString('fr-FR')} unit={quota.limit ? `/ ${quota.limit.toLocaleString('fr-FR')}` : null} caption={quota.percent === null ? (dashboard?.providerStatus?.odds?.message ?? 'Pas encore interrogé') : `${quota.percent} % disponible`} />
                <MetricCard label="Fréquence de scan" value={hotInterval ?? '—'} unit={hotInterval ? 'secondes' : null} caption={hotInterval ? `Matchs chauds${calmInterval ? ` · calmes : ${calmInterval} s` : ''}` : 'Paramètre non chargé'} />
              </div>

              <Section title="Alertes actives" aside={expirationMinutes ? `Expirent après ${expirationMinutes} min` : null}>
                {parsedAlerts.length ? <div className="alerts-grid">{parsedAlerts.map(({ alert, parsed }) => <AlertCard key={alert.id} alert={alert} parsed={parsed} competition={competitionOf(alert.match)} ruleTitle={parsed?.rule ? `${ruleTitles[parsed.rule] ?? 'Règle'} (${parsed.rule})` : null} countdown={formatCountdown(alert.expiresAt, now)} />)}</div> : <div className="panel"><EmptyState icon="bell" title="Aucune alerte active" message="Les signaux restent soumis aux règles et aux paramètres confirmés." /></div>}
              </Section>

              <Section title="Matchs suivis" action={<button className="button button-ghost" type="button" onClick={() => selectPage('matches')}>Gérer les matchs <Icon name="arrow" size={16} /></button>}>
                <div className="panel panel-flush">
                  {trackedMatches.length ? <><div className="table-scroll hide-on-phone"><table className="data-table"><thead><tr><th scope="col">Ligue</th><th scope="col">Match</th><th scope="col">Min.</th><th scope="col">Score</th><th scope="col">Vitalité</th><th scope="col">Décision</th></tr></thead><tbody>{trackedMatches.map((match) => {
                    const decision = trackedMatchDecision(match, parsedAlerts, minimumVitality)
                    return <tr key={match.id}><td className="cell-muted">{match.competition ?? '—'}</td><td><strong>{match.homeTeam} – {match.awayTeam}</strong><small>{match.statisticsAvailable === false ? 'Sans stats · ' : ''}{match.trackingMode === 'auto' ? 'Suivi automatique · ' : ''}relevé {elapsedLabel(match.capturedAt, now)}</small></td><td className="num">{match.minute === null || match.minute === undefined ? '—' : `${match.minute}'`}</td><td className="num">{match.homeScore ?? '—'}-{match.awayScore ?? '—'}</td><td><VitalityBar value={match.vitality} minimum={minimumVitality} /></td><td><Pill tone={decision.tone}>{decision.label}</Pill></td></tr>
                  })}</tbody></table></div>
                  <ul className="match-cards show-on-phone">{trackedMatches.map((match) => {
                    const decision = trackedMatchDecision(match, parsedAlerts, minimumVitality)
                    return <li key={match.id} className="match-card">
                      <div className="match-card-top"><strong>{match.homeTeam} – {match.awayTeam}</strong><span className="num match-card-score">{match.homeScore ?? '—'}-{match.awayScore ?? '—'}</span></div>
                      <div className="match-card-meta"><span>{match.competition ?? 'Compétition inconnue'}</span><span className="num">{match.minute === null || match.minute === undefined ? '—' : `${match.minute}'`}</span></div>
                      <div className="match-card-pills"><Pill tone={decision.tone}>{decision.label}</Pill></div>
                      <div className="match-card-vitality"><span>Vitalité</span><VitalityBar value={match.vitality} minimum={minimumVitality} /></div>
                      <p className="match-card-reason">{match.statisticsAvailable === false ? 'Sans stats · ' : ''}{match.trackingMode === 'auto' ? 'Suivi automatique · ' : ''}relevé {elapsedLabel(match.capturedAt, now)}</p>
                    </li>
                  })}</ul></> : <EmptyState icon="target" title="Aucun match suivi" message="Ajoutez une rencontre avec le Scan ciblé, ou attendez un match des championnats suivis automatiquement." />}
                </div>
              </Section>

              <Section title="Fournisseurs">
                <div className="provider-grid">{[['football', 'Données des matchs'], ['odds', 'Cotes']].map(([provider, label]) => <article className="panel provider-card" key={provider}><h3>{label}</h3><p><span className="num">{dashboard?.quotas?.[provider] === null || dashboard?.quotas?.[provider] === undefined ? '—' : Number(dashboard.quotas[provider]).toLocaleString('fr-FR')}</span> requêtes restantes</p><small>{dashboard?.providerStatus?.[provider]?.message ?? 'Pas encore interrogé'}</small></article>)}</div>
              </Section>
            </>
          )}

          {activePage === 'matches' && (
            <>
              {scanModeControl}
              <div className="message message-neutral"><Icon name="clock" size={18} /><span><strong>{matchesData?.message ?? 'Le flux sera consulté à l’ouverture de cette page.'}</strong> Quota restant : <span className="num">{matchesData?.quotaRemaining ?? 'inconnu'}</span>. Aucun match ne peut être suivi si le fournisseur indique un quota nul.</span></div>
              <Section title="Rencontres disponibles" aside={simulation ? 'Données fictives (voir le bandeau).' : 'Flux du fournisseur, actualisé à l’ouverture de la page.'} action={<button className="button button-ghost" type="button" onClick={() => void loadMatches()}><Icon name="refresh" size={16} />Actualiser</button>}>
                <div className="panel panel-flush">
                  <div className="matches-toolbar">
                    <label className="field matches-search">Rechercher une équipe ou une compétition<input type="search" value={matchSearch} onChange={(event) => { setMatchSearch(event.target.value); setVisibleMatchCount(MATCHES_PAGE_SIZE) }} placeholder="Ex. Arsenal, Ligue 1…" /></label>
                    <p className="matches-count">{matchesData?.matches ? <><span className="num">{matchesView.length}</span> rencontre{matchesView.length > 1 ? 's' : ''} sur <span className="num">{matchesData.matches.length}</span>{` · ${activeLeague.key === 'tous' ? `${plural(trackedLeagueIds.length, 'championnat')} suivi${trackedLeagueIds.length > 1 ? 's' : ''}` : activeLeague.key === 'autres' ? 'autres championnats' : activeLeague.label}`}{autoOpenedOthers ? ' · aucun match en direct dans les championnats suivis, « Autres » ouvert automatiquement' : ''}</> : 'Flux non chargé'}</p>
                    <div className="league-filter" role="group" aria-label="Filtrer par championnat">
                      {leagueChips.map((chip) => <button key={chip.key} type="button" className={`league-chip ${leagueCounts[chip.key] === 0 ? 'league-chip-empty' : ''}`} aria-pressed={activeLeague.key === chip.key} onClick={() => chooseLeague(chip.key)}>{chip.label}<span className="num league-chip-count" aria-label={`${leagueCounts[chip.key]} match${leagueCounts[chip.key] > 1 ? 's' : ''} en direct`}>{leagueCounts[chip.key]}</span></button>)}
                    </div>
                  </div>
                  {matchesView.length ? <><div className="table-scroll table-scroll-sticky hide-on-phone"><table className="data-table data-table-matches"><thead><tr><th scope="col">Rencontre</th><th scope="col">Compétition</th><th scope="col">État</th><th scope="col">Score</th><th scope="col">Cotes score exact</th><th scope="col">Statistiques</th><th scope="col" className="col-tracking">Suivi</th><th scope="col">Action</th></tr></thead><tbody>{visibleMatchRows.map((row) => {
                    const { match, alerted, statisticsNote } = row
                    return <tr key={match.providerMatchId} className={match.tracked || alerted ? 'row-highlight' : undefined}><td><strong>{match.homeTeam} – {match.awayTeam}</strong><small>{match.tracked ? <span className="tracked-note">Suivi · </span> : null}{alerted ? 'Alerte active · ' : ''}{match.kickoffAt ? `Début ${formatTime(match.kickoffAt)}` : 'Horaire non disponible'}</small></td><td className="cell-muted cell-ellipsis" title={match.competition ?? undefined}>{match.competition ?? '—'}</td><td className="num cell-nowrap">{matchStatusLabel(match.status, match.minute)}</td><td className="num cell-nowrap">{match.homeScore ?? '—'}-{match.awayScore ?? '—'}</td><td>{match.exactScoreMarketAvailable ? <Pill tone="alert">Disponible</Pill> : <Pill tone="dead">Non disponible</Pill>}</td><td><span title={statisticsNote}>{match.statisticsCoverage === null ? <Pill tone="watch">Non confirmées</Pill> : match.statisticsCoverage ? <Pill tone="alert">{match.statisticsCoverageFallback ? 'Disponible*' : 'Disponible'}</Pill> : allowWithoutStatistics && match.exactScoreMarketAvailable ? <Pill tone="high">Sans stats</Pill> : <Pill tone="dead">Non disponible</Pill>}</span></td><td className="col-tracking">{match.tracked ? <Pill tone="alert">Suivi</Pill> : <Pill tone="watch">Non suivi</Pill>}</td><td className="cell-action">{matchAction(row, true)}</td></tr>
                  })}</tbody></table></div>
                  <ul className="match-cards show-on-phone">{visibleMatchRows.map((row) => {
                    const { match, alerted, reason } = row
                    return <li key={match.providerMatchId} className={`match-card ${match.tracked || alerted ? 'match-card-highlight' : ''}`}>
                      <div className="match-card-top"><strong>{match.homeTeam} – {match.awayTeam}</strong><span className="num match-card-score">{match.homeScore ?? '—'}-{match.awayScore ?? '—'}</span></div>
                      <div className="match-card-meta"><span>{match.competition ?? 'Compétition inconnue'}</span><span className="num">{matchStatusLabel(match.status, match.minute)}</span></div>
                      <div className="match-card-pills">{match.tracked && <Pill tone="alert">Suivi</Pill>}{alerted && <Pill tone="high">Alerte active</Pill>}{match.exactScoreMarketAvailable ? <Pill tone="alert">Cotes disponibles</Pill> : <Pill tone="dead">Cotes non disponibles</Pill>}{match.statisticsCoverage === null ? <Pill tone="watch">Stats non confirmées</Pill> : match.statisticsCoverage ? <Pill tone="alert">{match.statisticsCoverageFallback ? 'Stats disponibles*' : 'Stats disponibles'}</Pill> : allowWithoutStatistics && match.exactScoreMarketAvailable ? <Pill tone="high">Sans stats</Pill> : <Pill tone="dead">Stats non disponibles</Pill>}</div>
                      {reason && <p className="match-card-reason">{reason}</p>}
                      <div className="match-card-foot"><small>{match.kickoffAt ? `Début ${formatTime(match.kickoffAt)}` : 'Horaire non disponible'}</small>{matchAction(row, false)}</div>
                    </li>
                  })}</ul></> : <EmptyState icon="search" title={matchesData?.matches?.length ? 'Aucune rencontre pour ce filtre' : 'Aucune rencontre disponible'} message={matchesData?.matches?.length ? 'Modifiez la recherche ou choisissez un autre championnat (« Autres » regroupe les compétitions non suivies).' : 'Le fournisseur n’a retourné aucun match pour le moment.'} />}
                  {matchesView.length > visibleMatchCount && <div className="table-more"><button className="button button-ghost" type="button" onClick={() => setVisibleMatchCount((count) => count + MATCHES_PAGE_SIZE)}>Afficher plus <span className="num">({matchesView.length - visibleMatchCount} restante{matchesView.length - visibleMatchCount > 1 ? 's' : ''})</span></button></div>}
                  {matchesView.some((match) => match.statisticsCoverageFallback) && <p className="table-footnote">* Couverture des statistiques lue sur la saison courante.</p>}
                </div>
              </Section>
              <Section title="Matchs à venir aujourd’hui" aside={upcomingData?.cachedAt ? `Liste du jour lue à ${formatTime(upcomingData.cachedAt)}, actualisée au plus toutes les 15 minutes. Pas de cotes ni de statistiques avant le coup d’envoi.` : 'Liste du jour, actualisée au plus toutes les 15 minutes.'}>
                <div className="panel panel-flush">
                  {upcomingError && <p className="message message-error" role="alert">{upcomingError}</p>}
                  {visibleUpcoming.length ? <><div className="table-scroll hide-on-phone"><table className="data-table data-table-matches"><thead><tr><th scope="col">Heure</th><th scope="col">Compétition</th><th scope="col">Rencontre</th><th scope="col">Suivi</th><th scope="col">Action</th></tr></thead><tbody>{visibleUpcoming.map((match) => (
                    <tr key={match.providerMatchId} className={match.scheduled ? 'row-highlight' : undefined}><td className="num cell-nowrap">{match.kickoffAt ? formatTime(match.kickoffAt) : '—'}</td><td className="cell-muted cell-ellipsis" title={match.competition ?? undefined}>{match.competition ?? '—'}</td><td><strong>{match.homeTeam} – {match.awayTeam}</strong></td><td>{match.scheduled ? <Pill tone="alert">Planifié</Pill> : <Pill tone="watch">Non planifié</Pill>}</td><td className="cell-action">{scheduleButton(match)}</td></tr>
                  ))}</tbody></table></div>
                  <ul className="match-cards show-on-phone">{visibleUpcoming.map((match) => (
                    <li key={match.providerMatchId} className={`match-card ${match.scheduled ? 'match-card-highlight' : ''}`}>
                      <div className="match-card-top"><strong>{match.homeTeam} – {match.awayTeam}</strong><span className="num match-card-score">{match.kickoffAt ? formatTime(match.kickoffAt) : '—'}</span></div>
                      <div className="match-card-meta"><span>{match.competition ?? 'Compétition inconnue'}</span>{match.scheduled && <Pill tone="alert">Planifié</Pill>}</div>
                      <div className="match-card-foot"><small>Coup d’envoi {match.kickoffAt ? formatTime(match.kickoffAt) : 'non précisé'}</small>{scheduleButton(match)}</div>
                    </li>
                  ))}</ul></> : <EmptyState icon="clock" title={upcomingData ? 'Aucun match à venir pour ce filtre' : 'Liste du jour non chargée'} message={upcomingData ? 'Choisissez un autre championnat ou modifiez la recherche.' : 'Elle se charge à l’ouverture de la page.'} />}
                  {upcomingView.length > visibleUpcomingCount && <div className="table-more"><button className="button button-ghost" type="button" onClick={() => setVisibleUpcomingCount((count) => count + MATCHES_PAGE_SIZE)}>Afficher plus <span className="num">({upcomingView.length - visibleUpcomingCount} restants)</span></button></div>}
                </div>
              </Section>
              <Section title="Fiches des matchs suivis" aside="Statistiques brutes du dernier relevé, par équipe. Elles ne sont pas converties en vitalité.">
                {trackedMatches.length ? <div className="sheets-grid">{trackedMatches.map((match) => {
                  const rows = teamStatisticsRows(match.teamStatistics)
                  return <article className="panel match-sheet" key={match.id}>
                    <div className="match-sheet-top"><div><h3>{match.homeTeam} – {match.awayTeam}</h3><p className="cell-muted">{match.competition ?? 'Compétition inconnue'}</p></div><span className="num match-sheet-score">{match.homeScore ?? '—'}-{match.awayScore ?? '—'}{match.minute === null || match.minute === undefined ? '' : ` · ${match.minute}'`}</span></div>
                    {rows.length ? <div className="table-scroll"><table className="data-table data-table-compact"><thead><tr><th scope="col">Statistique</th><th scope="col">{match.homeTeam}</th><th scope="col">{match.awayTeam}</th></tr></thead><tbody>{rows.map((row) => <tr key={row.key}><td className="cell-muted">{row.label}</td><td className="num">{row.home}</td><td className="num">{row.away}</td></tr>)}</tbody></table></div> : <p className="field-help">Statistiques par équipe non disponibles.</p>}
                    <div className="match-sheet-vitality"><span>Vitalité</span>{match.vitality === null || match.vitality === undefined ? <strong>Non calculable : une statistique manque</strong> : <VitalityBar value={match.vitality} minimum={minimumVitality} />}</div>
                    <p className="field-help">Statistiques relevées : {match.statisticsCapturedAt ? formatDate(match.statisticsCapturedAt) : 'non disponible'}</p>
                  </article>
                })}</div> : <div className="panel"><EmptyState icon="target" title="Aucun match suivi" message="Suivez une rencontre pour afficher sa fiche." /></div>}
              </Section>
            </>
          )}

          {activePage === 'rules' && (
            <>
              {ruleProfile?.profile && (ruleProfile.profile.activeRules ?? []).length === 0 && <div className="message message-critical" role="alert"><Icon name="shield" size={18} /><span><strong>Le profil actif « {ruleProfile.profile.name} » n’a aucune règle cochée.</strong> Aucune alerte de règle ne peut être produite (ni mi-temps, ni écart, ni forte baisse). Cochez les règles voulues ci-dessous puis sauvegardez le profil.</span></div>}
              <div className="message message-warning"><Icon name="shield" size={18} /><span><strong>Les règles non définies ne déclenchent jamais de signal.</strong> Les poids de convergence sont laissés vides jusqu’à validation par le client.</span></div>
              <Section title="Règles Phase 1" aside={`${ruleDescriptions.length} règles documentées · activation limitée aux règles disponibles dans le moteur.`}>
                <div className="panel panel-flush rule-table">{ruleDescriptions.map((rule) => <article className="rule-row" key={rule.id}><span className="rule-id num">{rule.id}</span><div className="rule-info"><strong>{rule.title}</strong><p>{rule.detail}</p></div><Pill tone={rule.status === 'Disponible' ? 'alert' : rule.status === 'Partiel' ? 'high' : 'dead'}>{rule.status}</Pill></article>)}</div>
              </Section>
              <Section title="Profils de règles" aside={`Profil actif : ${ruleProfile?.profile?.name ?? 'aucun'}. Les poids laissés vides ne sont pas ajoutés au profil.`}>
                <form className="panel form-stack" onSubmit={saveRuleProfile}>
                  <div className="field-grid"><label className="field">Profil<select value={profileDraft.id ?? ''} onChange={(event) => setProfileDraft(profileToDraft(ruleProfile?.profiles?.find((profile) => profile.id === Number(event.target.value))))}>{(ruleProfile?.profiles ?? []).map((profile) => <option key={profile.id} value={profile.id}>{profile.name}{profile.isActive ? ' (actif)' : ''}</option>)}</select></label><label className="field">Nouveau profil<input type="text" maxLength="120" value={newProfileName} onChange={(event) => setNewProfileName(event.target.value)} placeholder="Nom du profil" /></label></div>
                  <div className="form-actions"><button className="button button-ghost" type="button" disabled={isBusy || newProfileName.trim() === ''} onClick={() => void createRuleProfile()}>+ Créer un nouveau profil</button><button className="button button-ghost" type="button" disabled={isBusy || !profileDraft.id || ruleProfile?.profile?.id === profileDraft.id} onClick={() => void activateRuleProfile()}>Activer ce profil</button></div>
                  <fieldset className="fieldset"><legend>1. Sélection des méthodes à combiner</legend><div className="check-grid">{(ruleProfile?.availableRules ?? []).map((rule) => <label className="check-row" key={rule}><input type="checkbox" checked={profileDraft.activeRules.includes(rule)} onChange={(event) => setProfileDraft((previous) => ({ ...previous, activeRules: event.target.checked ? [...previous.activeRules, rule] : previous.activeRules.filter((item) => item !== rule) }))} /><span className="num">{rule}</span></label>)}</div></fieldset>
                  <fieldset className="fieldset"><legend>2. Pondération (poids de chaque méthode, à confirmer par le client)</legend><div className="field-grid">{(ruleProfile?.availableRules ?? []).map((rule) => <label className="field" key={rule}>Poids — {rule}<input className="num" min="0" step="0.01" type="number" value={profileDraft.methodWeights[rule] ?? ''} onChange={(event) => setProfileDraft((previous) => ({ ...previous, methodWeights: { ...previous.methodWeights, [rule]: event.target.value } }))} placeholder="À confirmer" /></label>)}</div></fieldset>
                  <label className="field">3. Seuil de validation : score de confiance supérieur à (%)<input className="num" min="0" max="100" step="0.1" type="number" value={profileDraft.validationThreshold ?? ''} onChange={(event) => setProfileDraft((previous) => ({ ...previous, validationThreshold: event.target.value }))} placeholder="75 (valeur du PRD par défaut)" /><span className="field-help">Appliqué seulement si l’étape « convergence » est activée dans Paramètres (désactivée par défaut).</span></label>
                  <fieldset className="fieldset"><legend>Scores des méthodes pour le test (0–100)</legend><p className="field-help">Aucune formule de score par méthode n’est fournie : saisissez les scores à tester. Le test utilise le profil sauvegardé et la situation du Testeur manuel.</p><div className="field-grid">{profileDraft.activeRules.map((rule) => <label className="field" key={rule}>Score — {rule}<input className="num" min="0" max="100" step="1" type="number" value={combinationScores[rule] ?? ''} onChange={(event) => setCombinationScores((previous) => ({ ...previous, [rule]: event.target.value }))} /></label>)}</div></fieldset>
                  <div className="form-actions"><button className="button button-ghost" type="button" disabled={isBusy || !profileDraft.id} onClick={() => void testCombination()}>Tester la combinaison</button><button className="button button-primary" type="submit" disabled={isBusy}>Sauvegarder le profil</button></div>
                  {combinationError && <p className="message message-error" role="alert">{combinationError}</p>}
                  {combinationResult && <SimulationResult result={combinationResult} />}
                </form>
              </Section>
            </>
          )}

          {activePage === 'tester' && (
            <>
              <div className="message message-neutral"><Icon name="shield" size={18} /><span><strong>Les résultats affichés sont une simulation locale.</strong> Aucun message n’est envoyé. Une baisse de plus de 5 % de la cote du score suggéré donne une alerte critique ; une hausse bloque (complément 2 de l’annexe).</span></div>
              <div className="tester-layout">
                <Section title="Situation du match" aside="Saisissez les données du scénario à évaluer (F125).">
                  <form className="panel form-stack" onSubmit={testRules}>
                    <div className="score-row"><label className="field">Score à domicile<input className="num" min="0" max="20" type="number" value={testFields.homeScore} onChange={updateTestField('homeScore')} required /></label><span className="score-separator num" aria-hidden="true">–</span><label className="field">Score à l’extérieur<input className="num" min="0" max="20" type="number" value={testFields.awayScore} onChange={updateTestField('awayScore')} required /></label></div>
                    <label className="field">Cotes des scores exacts <span className="label-note">une ligne par score</span><textarea className="num" rows="5" spellCheck="false" value={testFields.oddsText} onChange={updateTestField('oddsText')} placeholder={'0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80'} required /></label>
                    <div className="field-grid"><label className="field">Vitalité (0–100)<input className="num" min="0" max="100" step="0.1" type="number" value={testFields.vitalityScore} onChange={updateTestField('vitalityScore')} /><span className="field-help">Vide = non calculable.</span></label><label className="field">Variation des cotes sur 2 min (%)<input className="num" step="0.01" type="number" value={testFields.oddsChangePercent} onChange={updateTestField('oddsChangePercent')} /><span className="field-help">Valeur négative = cotes en baisse. Vide = non calculable.</span></label></div>
                    <div className="field-grid"><label className="check-row check-row-boxed"><input type="checkbox" checked={testFields.halftime} onChange={(event) => setTestFields((previous) => ({ ...previous, halftime: event.target.checked }))} />Match à la mi-temps</label><label className="field">Cote Under 2.5 (total du match)<input className="num" min="0" step="0.01" type="number" value={testFields.under25Odds} onChange={updateTestField('under25Odds')} /></label></div>
                    <div className="field-grid"><label className="field">Source de tendance<select value={testFields.tendanceSource} onChange={updateTestField('tendanceSource')}><option value="cote_suggeree">Cote du score suggéré</option></select></label><label className="field">Seuil de baisse (%)<input className="num" min="0" step="0.1" type="number" value={testFields.tendanceSeuilStable} onChange={updateTestField('tendanceSeuilStable')} /></label></div>
                    <p className="field-help">Format accepté : <code>score = cote</code> ou <code>score : cote</code>. Les paramètres de tendance ne s’appliquent qu’à cette simulation.</p>
                    {testError && <div className="message message-error" role="alert">{testError}</div>}
                    <button className="button button-primary button-large" type="submit" disabled={isTesting}>{isTesting ? 'Évaluation…' : 'Évaluer la situation'} <Icon name="arrow" size={17} /></button>
                  </form>
                </Section>
                <Section title="Résultat de la simulation" aside="Analyse des règles et des filtres.">
                  <div className="panel" aria-live="polite">{testResult ? <SimulationResult result={testResult} /> : <EmptyState icon="flask" title="Prêt à tester" message="Les résultats apparaîtront ici après l’évaluation des données saisies." />}</div>
                </Section>
              </div>
            </>
          )}

          {activePage === 'journal' && (
            <>
              <form className="panel filter-toolbar" onSubmit={(event) => { event.preventDefault(); void loadJournal(journalFilters) }}><label className="field">Du<input type="date" value={journalFilters.date_from} onChange={(event) => setJournalFilters((previous) => ({ ...previous, date_from: event.target.value }))} /></label><label className="field">Au<input type="date" value={journalFilters.date_to} onChange={(event) => setJournalFilters((previous) => ({ ...previous, date_to: event.target.value }))} /></label><label className="field">ID du match<input className="num" min="1" type="number" value={journalFilters.match_id} onChange={(event) => setJournalFilters((previous) => ({ ...previous, match_id: event.target.value }))} /></label><label className="field">Règle<input value={journalFilters.rule_id} onChange={(event) => setJournalFilters((previous) => ({ ...previous, rule_id: event.target.value }))} placeholder="F121-C" /></label><label className="field">État<select value={journalFilters.status} onChange={(event) => setJournalFilters((previous) => ({ ...previous, status: event.target.value }))}><option value="">Tous</option><option value="sans_alerte">Sans alerte</option><option value="queued">En attente</option><option value="sent">Envoyée</option><option value="failed">Échec</option><option value="expired">Expirée</option><option value="invalidated">Invalidée</option></select></label><button className="button button-secondary" type="submit"><Icon name="search" size={16} />Filtrer</button></form>
              <Section title="Événements récents" aside={`${journalData?.pagination?.total ?? 0} événement(s)`}>
                <div className="panel panel-flush">
                  {journalData?.data?.length ? <><div className="table-scroll hide-on-phone"><table className="data-table"><thead><tr><th scope="col">Date</th><th scope="col">Rencontre</th><th scope="col">Score / minute</th><th scope="col">Règle</th><th scope="col">Décision</th><th scope="col">Justification</th></tr></thead><tbody>{journalData.data.map((log) => <Fragment key={log.id}><tr className={log.alert ? 'row-with-options' : undefined}><td className="num cell-nowrap">{formatDate(log.evaluatedAt)}{log.repeatCount > 1 && <small>{log.repeatCount} relevés identiques depuis {formatTime(log.firstEvaluatedAt)}</small>}</td><td><strong>{log.match ?? '—'}</strong></td><td className="num cell-nowrap">{log.score ?? '—'}{log.minute === null ? '' : ` · ${log.minute}'`}</td><td className="num cell-nowrap">{log.ruleId ?? '—'}</td><td><Pill tone={log.decision === 'no_alert' ? (log.eventType === 'evaluation' ? 'watch' : 'dead') : journalTones[log.decision] ?? 'watch'}>{journalDecisionLabel(log)}</Pill></td><td className="cell-reason"><ReasonText text={log.reason} /></td></tr>{log.alert && <tr className="row-options"><td colSpan={6}><span className="row-options-title">Options de l’alerte : décision et résultat</span><AlertOptionsEditor log={log} busy={isBusy} decisions={OPTION_DECISIONS} outcomes={OPTION_OUTCOMES} onOption={(id, changes) => void updateOption(id, changes)} onLegacyOutcome={(id, outcome) => void updateOutcome(id, outcome)} /></td></tr>}</Fragment>)}</tbody></table></div>
                  <ul className="match-cards show-on-phone">{journalData.data.map((log) => (
                    <li key={log.id} className={`match-card ${log.alert ? 'match-card-highlight' : ''}`}>
                      <div className="match-card-top"><strong>{log.match ?? '—'}</strong><span className="num match-card-score">{log.score ?? '—'}{log.minute === null ? '' : ` · ${log.minute}'`}</span></div>
                      <div className="match-card-meta"><span>{formatDate(log.evaluatedAt)}</span><span className="num">{log.ruleId ?? '—'}</span></div>
                      <div className="match-card-pills"><Pill tone={log.decision === 'no_alert' ? (log.eventType === 'evaluation' ? 'watch' : 'dead') : journalTones[log.decision] ?? 'watch'}>{journalDecisionLabel(log)}</Pill>{log.repeatCount > 1 && <Pill tone="watch" dot={false}>{log.repeatCount} relevés</Pill>}</div>
                      <div className="match-card-reason"><ReasonText text={log.reason} limit={120} /></div>
                      {log.alert && <AlertOptionsEditor log={log} busy={isBusy} decisions={OPTION_DECISIONS} outcomes={OPTION_OUTCOMES} onOption={(id, changes) => void updateOption(id, changes)} onLegacyOutcome={(id, outcome) => void updateOutcome(id, outcome)} />}
                    </li>
                  ))}</ul></> : <EmptyState icon="list" title="Aucun événement" message="Aucune évaluation ne correspond aux critères choisis." />}
                </div>
                {journalData?.pagination?.lastPage > 1 && <div className="pagination"><button className="button button-ghost" type="button" disabled={journalData.pagination.currentPage <= 1} onClick={() => void loadJournal({ ...journalFilters, page: String(journalData.pagination.currentPage - 1) })}>Précédent</button><span>Page <span className="num">{journalData.pagination.currentPage} / {journalData.pagination.lastPage}</span></span><button className="button button-ghost" type="button" disabled={journalData.pagination.currentPage >= journalData.pagination.lastPage} onClick={() => void loadJournal({ ...journalFilters, page: String(journalData.pagination.currentPage + 1) })}>Suivant</button></div>}
              </Section>
            </>
          )}

          {activePage === 'statistics' && (
            <>
              <form className="panel filter-toolbar" onSubmit={(event) => { event.preventDefault(); void loadStatistics(statisticsFilters) }}><label className="field">Du<input type="date" value={statisticsFilters.date_from} onChange={(event) => setStatisticsFilters((previous) => ({ ...previous, date_from: event.target.value }))} /></label><label className="field">Au<input type="date" value={statisticsFilters.date_to} onChange={(event) => setStatisticsFilters((previous) => ({ ...previous, date_to: event.target.value }))} /></label><button className="button button-secondary" type="submit"><Icon name="search" size={16} />Appliquer</button></form>
              <div className="metrics-grid metrics-grid-wide">{[['Alertes', statistics?.alerts?.total], ['Actives', statistics?.alerts?.active], ['Gagnées', statistics?.alerts?.won], ['Perdues', statistics?.alerts?.lost], ['Annulées', statistics?.alerts?.cancelled], ['Sans résultat', statistics?.alerts?.unrated], ['Taux de réussite', statistics?.alerts?.successRatePercent === null || statistics?.alerts?.successRatePercent === undefined ? '—' : `${statistics.alerts.successRatePercent} %`]].map(([label, value]) => <MetricCard key={label} label={label} value={value ?? '—'} />)}</div>
              <div className="metrics-grid">{[['targeted', 'Option ciblée'], ['neutral', 'Option neutre']].map(([type, label]) => { const block = statistics?.byType?.[type]; const rate = (value) => value === null || value === undefined ? '—' : `${value} %`; return <MetricCard key={type} label={label} value={rate(block?.successRatePercent)} caption={`Toutes : ${block?.won ?? 0} gagnée(s), ${block?.lost ?? 0} perdue(s) · jouées : ${rate(block?.played?.successRatePercent)} (${block?.played?.won ?? 0} / ${(block?.played?.won ?? 0) + (block?.played?.lost ?? 0)})`} /> })}</div>
              <Section title="Réussite par règle et par option" aside="Taux = gagnées ÷ (gagnées + perdues) ; annulées et en attente exclues. « Jouées » : seulement les options marquées jouées.">
                <div className="panel panel-flush">
                  {statisticsOptionRows(statistics?.byRule).length ? <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Règle</th><th scope="col">Option</th><th scope="col">Gagnées</th><th scope="col">Perdues</th><th scope="col">Annulées</th><th scope="col">En attente</th><th scope="col">Taux (toutes)</th><th scope="col">Taux (jouées)</th></tr></thead><tbody>{statisticsOptionRows(statistics?.byRule).map((row) => <tr key={row.key}><td className="num"><strong>{row.rule}</strong></td><td>{row.label}</td><td className="num">{row.won}</td><td className="num">{row.lost}</td><td className="num">{row.cancelled}</td><td className="num">{row.pending}</td><td className="num">{row.successRatePercent === null ? '—' : `${row.successRatePercent} %`}</td><td className="num">{row.played?.successRatePercent === null || row.played?.successRatePercent === undefined ? '—' : `${row.played.successRatePercent} %`}<small>{row.played?.options ?? 0} jouée(s)</small></td></tr>)}</tbody></table></div> : <EmptyState icon="chart" title="Pas encore de résultats par option" message="Les résultats sont calculés automatiquement à la fin de chaque match ayant une alerte." />}
                </div>
              </Section>
              <Section title="Résultats par règle">
                <div className="panel panel-flush">
                  {statistics?.byRule && Object.keys(statistics.byRule).length ? <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Règle</th><th scope="col">Alertes</th><th scope="col">Gagnées</th><th scope="col">Perdues</th><th scope="col">Annulées</th><th scope="col">Taux</th></tr></thead><tbody>{Object.entries(statistics.byRule).map(([rule, data]) => <tr key={rule}><td className="num"><strong>{rule}</strong></td><td className="num">{data.alerts}</td><td className="num">{data.won}</td><td className="num">{data.lost}</td><td className="num">{data.cancelled}</td><td className="num">{data.successRatePercent === null ? '—' : `${data.successRatePercent} %`}</td></tr>)}</tbody></table></div> : <EmptyState icon="chart" title="Pas encore de résultats" message="Les statistiques apparaîtront lorsque des alertes et leurs résultats seront consignés." />}
                </div>
              </Section>
              {statistics?.refusalsByFilter && Object.keys(statistics.refusalsByFilter).length > 0 && <Section title="Refus par filtre"><div className="panel">{Object.entries(statistics.refusalsByFilter).map(([filter, count]) => <div className="simulation-line" key={filter}><span>{filter}</span><strong className="num">{count}</strong></div>)}</div></Section>}
            </>
          )}

          {activePage === 'settings' && (
            <>
              {scanModeControl}
              {notificationTest && <div className={`message ${notificationTest.status === 'error' ? 'message-error' : notificationTest.status === 'warning' ? 'message-warning' : 'message-success'}`} role={notificationTest.status === 'error' ? 'alert' : 'status'}><span><strong>{notificationTest.status === 'error' ? 'Échec de l’envoi : ' : notificationTest.status === 'warning' ? 'Attention : ' : 'Message envoyé : '}</strong>{notificationTest.text}</span></div>}
              <div className="message message-warning"><Icon name="shield" size={18} /><span><strong>Les paramètres marqués « À confirmer » attendent une décision du client.</strong> Leur valeur par défaut reste prudente. Aucun pari automatique n’est effectué.</span></div>
              <Section title="Paramètres du détecteur" aside="Les champs sans valeur ne déclenchent pas de comportement supposé.">
                <form className="panel settings-form" onSubmit={saveSettings}>
                  {settings.length ? <div className="settings-list">{settings.map((setting) => <label className="setting-row" key={setting.key}><span className="setting-copy"><strong>{settingLabels[setting.key] ?? setting.key}</strong><small>{settingDescriptions[setting.key] ?? 'Paramètre utilisé par le détecteur.'}</small>{setting.needsConfirmation && <span className="setting-flag">À confirmer</span>}</span>{setting.type === 'boolean' ? <input type="checkbox" checked={settingsDraft[setting.key] === true} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.checked }))} /> : setting.type === 'json' ? <textarea className="num" rows="3" value={settingsDraft[setting.key] ?? ''} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))} placeholder="À confirmer" /> : setting.key === 'results.bet_validity' ? <select value={settingsDraft[setting.key] ?? 'match'} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))}><option value="match">Jusqu’à la fin du match</option><option value="alert">Pendant la durée de l’alerte</option></select> : setting.key === 'tendance_source' ? <select value={settingsDraft[setting.key] ?? ''} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))}><option value="cote_suggeree">Cote du score suggéré</option></select> : <input className={setting.type === 'integer' || setting.type === 'decimal' ? 'num' : undefined} type={setting.type === 'integer' || setting.type === 'decimal' ? 'number' : 'text'} min={setting.type === 'integer' || setting.type === 'decimal' ? '0' : undefined} step={setting.type === 'decimal' ? '0.01' : undefined} value={settingsDraft[setting.key] ?? ''} onChange={(event) => setSettingsDraft((previous) => ({ ...previous, [setting.key]: event.target.value }))} placeholder={setting.needsConfirmation ? 'À confirmer' : ''} />}</label>)}</div> : <EmptyState icon="settings" title="Paramètres indisponibles" message="Aucun paramètre enregistré n’a été retourné." />}
                  <div className="form-actions form-actions-sticky"><button className="button button-primary" type="submit" disabled={isBusy || !settings.length}>Enregistrer</button><button className="button button-ghost" type="button" onClick={() => void resetSettings()} disabled={isBusy}>Réinitialiser</button></div>
                </form>
              </Section>
              <Section title="Historique des modifications" aside="Les dernières modifications de paramètres sont conservées.">
                <div className="panel panel-flush">{settingsHistory.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Date</th><th scope="col">Paramètre</th><th scope="col">Ancienne valeur</th><th scope="col">Nouvelle valeur</th><th scope="col">Administrateur</th></tr></thead><tbody>{settingsHistory.map((change) => <tr key={change.id}><td className="num cell-nowrap">{formatDate(change.changedAt)}</td><td>{settingLabels[change.settingKey] ?? change.settingKey}</td><td className="num cell-value">{change.oldValue ?? '—'}</td><td className="num cell-value">{change.newValue ?? '—'}</td><td>{change.user}</td></tr>)}</tbody></table></div> : <EmptyState icon="list" title="Aucun changement" message="L’historique se remplira après la première modification." />}</div>
              </Section>
            </>
          )}
        </div>
        <footer className="footer"><span>PronoFoot · Phase 1 · détecteur live, aucun pari automatique</span><span>Aucun gain n’est garanti. Jeu réservé aux 18 ans et plus.</span></footer>
      </main>
    </div>
  )
}

export default App
