const SCORE_ENTRY = /^\s*(\d{1,2})\s*-\s*(\d{1,2})\s*[:=]\s*(\d+(?:[.,]\d+)?)\s*$/

export function parseCorrectScoreOdds(text) {
  const odds = {}
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

  if (lines.length === 0) {
    throw new Error('Saisis au moins une cote de score exact.')
  }

  for (const [index, line] of lines.entries()) {
    const match = line.match(SCORE_ENTRY)
    if (!match) {
      throw new Error(`Format incorrect à la ligne ${index + 1}. Utilise « 0-0 = 7,50 ».`)
    }

    const key = `${Number(match[1])}-${Number(match[2])}`
    const value = Number(match[3].replace(',', '.'))

    if (Object.hasOwn(odds, key)) {
      throw new Error(`Le score ${key} apparaît plusieurs fois.`)
    }

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`La cote du score ${key} doit être supérieure à zéro.`)
    }

    odds[key] = value
  }

  return odds
}

export function createRuleTestPayload({
  homeScore,
  awayScore,
  oddsText,
  vitalityScore,
  oddsChangePercent,
  tendanceSource = '',
  tendanceSeuilStable = '',
  halftime = false,
  under25Odds = '',
}) {
  const parsedHomeScore = Number(homeScore)
  const parsedAwayScore = Number(awayScore)
  const parsedVitality = vitalityScore === '' ? null : Number(vitalityScore)
  const parsedOddsChange = oddsChangePercent === '' ? null : Number(oddsChangePercent)
  const parsedUnder25 = under25Odds === '' ? null : Number(under25Odds)

  if (!Number.isInteger(parsedHomeScore) || parsedHomeScore < 0
    || !Number.isInteger(parsedAwayScore) || parsedAwayScore < 0) {
    throw new Error('Les scores doivent être des nombres entiers positifs ou nuls.')
  }

  if (parsedVitality !== null && (!Number.isFinite(parsedVitality) || parsedVitality < 0 || parsedVitality > 100)) {
    throw new Error('La vitalité doit être comprise entre 0 et 100.')
  }

  if (parsedOddsChange !== null && !Number.isFinite(parsedOddsChange)) {
    throw new Error('La variation des cotes sur deux minutes doit être un nombre valide.')
  }

  if (parsedUnder25 !== null && (!Number.isFinite(parsedUnder25) || parsedUnder25 <= 0)) {
    throw new Error('La cote Under 2.5 doit être supérieure à zéro.')
  }

  const parsedStableThreshold = tendanceSeuilStable === '' ? null : Number(tendanceSeuilStable)
  if (tendanceSource !== '' && tendanceSource !== 'cote_suggeree') {
    throw new Error('La source de tendance doit être cote_suggeree ou rester non confirmée.')
  }
  if (parsedStableThreshold !== null && (!Number.isFinite(parsedStableThreshold) || parsedStableThreshold < 0)) {
    throw new Error('Le seuil de tendance stable doit être un nombre positif ou nul.')
  }

  const exactScoreOdds = halftime && oddsText.trim() === '' ? {} : parseCorrectScoreOdds(oddsText)
  const requiredScores = halftime ? [] : [
    `${parsedHomeScore}-${parsedAwayScore}`,
    `${parsedHomeScore + 1}-${parsedAwayScore}`,
    `${parsedHomeScore}-${parsedAwayScore + 1}`,
  ]
  const missingScore = requiredScores.find((score) => !Object.hasOwn(exactScoreOdds, score))

  if (missingScore) {
    throw new Error(`La cote du score ${missingScore} est nécessaire pour tester F121-C.`)
  }

  return {
    home_score: parsedHomeScore,
    away_score: parsedAwayScore,
    exact_score_odds: exactScoreOdds,
    vitality_score: parsedVitality,
    odds_change_percent: parsedOddsChange,
    tendance_source: tendanceSource || null,
    tendance_seuil_stable: parsedStableThreshold,
    halftime: Boolean(halftime),
    under_2_5_odds: parsedUnder25,
  }
}

export async function requestAdminApi(path, csrfToken, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (method !== 'GET') {
    headers['X-CSRF-TOKEN'] = csrfToken
  }

  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Réponse admin inattendue (HTTP ${response.status}). Vérifiez la session administrateur.`)
  }
  const result = await response.json()

  if (!response.ok) {
    const validationMessage = result.errors ? Object.values(result.errors).flat().join(' ') : ''
    throw new Error(validationMessage || result.message || 'La requête admin a échoué.')
  }

  return result
}

const TEAM_STATISTICS = [
  ['shots', 'Tirs'],
  ['shots_on_target', 'Tirs cadrés'],
  ['corners', 'Corners'],
  ['possession', 'Possession'],
]

/**
 * Lignes brutes par équipe. Une valeur absente ou null reste « Non disponible », jamais 0.
 */
export function teamStatisticsRows(teamStatistics) {
  if (!teamStatistics || typeof teamStatistics !== 'object') return []

  const format = (key, value) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 'Non disponible'
    return key === 'possession' ? `${value} %` : String(value)
  }

  return TEAM_STATISTICS.map(([key, label]) => ({
    key,
    label,
    home: format(key, teamStatistics.home?.[key]),
    away: format(key, teamStatistics.away?.[key]),
  }))
}

const JOURNAL_INCIDENTS = {
  football_data_missing: 'Incident : données du match manquantes',
  football_provider_unavailable: 'Incident : fournisseur football indisponible',
  odds_provider_unavailable: 'Incident : fournisseur de cotes indisponible',
  odds_market_unavailable: 'Incident : marché des scores exacts indisponible',
  odds_data_missing: 'Incident : cotes du match manquantes',
  statistics_unavailable: 'Incident : statistiques indisponibles',
  match_stopped: 'Match arrêté',
  quota_threshold_reached: 'Quota épuisé',
  match_processing_error: 'Incident : erreur de traitement',
  scan_paused: 'Pas de scan (écart trop grand)',
  scan_resumed: 'Scan repris',
  match_finished: 'Match terminé : suivi arrêté',
  penalty_shootout: 'Tirs au but : pas d’analyse',
  plancher_scan: 'Plancher : aucun pari',
}

const JOURNAL_DECISIONS = {
  alert: 'Alerte',
  duplicate_suppressed: 'Doublon évité',
  reevaluate: 'But détecté',
  invalidated: 'Alerte invalidée',
  expired: 'Alerte expirée',
}

/**
 * Libellé français d'une ligne du Journal, à partir de sa décision et de son type d'événement.
 */
export function journalDecisionLabel({ decision, eventType }) {
  if (eventType === 'plancher_scan' && decision === 'alert') return 'Plancher'
  if (decision === 'no_alert') {
    return eventType === 'evaluation' ? 'Abstention' : (JOURNAL_INCIDENTS[eventType] ?? 'Incident')
  }

  return JOURNAL_DECISIONS[decision] ?? decision
}

const ALERT_LEVELS = {
  'ALERTE CRITIQUE': ['critical', 'Alerte Critique'],
  'ALERTE HAUTE': ['high', 'Alerte Haute'],
  'SIGNAL MI-TEMPS': ['halftime', 'Signal Mi-temps'],
  'PARI NEUTRE': ['neutral', 'Pari Neutre'],
  PLANCHER: ['neutral', 'Plancher'],
}

const LEVEL_SEVERITY = ['critical', 'high', 'halftime', 'neutral', 'other']

function titleCase(text) {
  return text.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, separator, letter) => separator + letter.toUpperCase())
}

function parseDecimal(value) {
  const number = Number(String(value).replace(',', '.').replace(/[^\d.+-]/g, ''))
  return Number.isFinite(number) ? number : null
}

/**
 * Lit le message d'alerte réel (format fixe d'AlertMessageFormatter) pour l'afficher en carte.
 * Retourne null si le message ne suit pas ce format : l'interface affiche alors le texte brut.
 */
export function parseAlertMessage(message) {
  const lines = String(message ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (lines.length < 2) return null

  const [titleLine, matchLine, ...rest] = lines
  const [title, validity = ''] = titleLine.split(' · ')
  const known = ALERT_LEVELS[title]
  if (!known && !title.startsWith('ALERTE ')) return null

  const matchParts = matchLine.match(/^(.+?)\s{2,}(\?-\?|\d+-\d+)(?:\s{2,}(\d+)')?$/)
  const parsed = {
    level: known ? known[0] : 'other',
    label: known ? known[1] : titleCase(title),
    validUntil: validity.match(/\d{1,2}:\d{2}/)?.[0] ?? null,
    match: matchParts ? matchParts[1] : matchLine,
    score: matchParts && matchParts[2] !== '?-?' ? matchParts[2] : null,
    minute: matchParts?.[3] === undefined ? null : Number(matchParts[3]),
    target: null,
    bet: null,
    suggestedScore: null,
    odds: [],
    gap: null,
    vitality: null,
    trend: null,
    rule: null,
    confidence: null,
    vitalityNote: null,
    options: [],
  }

  for (const line of rest) {
    for (const part of line.split(' | ')) {
      const separator = part.indexOf(' : ')
      if (separator < 0) continue
      const key = part.slice(0, separator).trim()
      const value = part.slice(separator + 3).trim()

      if (key === 'Prochain but') parsed.target = value
      else if (key === 'Pari') parsed.bet = value
      else if (key === 'Pari central' || key === 'Pari prudent') {
        parsed.options.push({ label: key, text: value })
        parsed.bet ??= value
      }
      else if (key === 'Écart') parsed.gap = value === 'n.c.' ? null : value
      else if (key === 'Vitalité' && value.startsWith('non disponible')) parsed.vitalityNote = `Vitalité ${value}`
      else if (key === 'Vitalité') parsed.vitality = value === 'n.c.' ? null : parseDecimal(value.split('/')[0])
      else if (key.startsWith('Option')) parsed.options.push({ label: key, text: value })
      else if (key === 'Tendance') parsed.trend = value === 'n.c.' ? null : value
      else if (key === 'Règle') parsed.rule = value
      else if (key === 'Confiance') parsed.confidence = value
      else if (key.startsWith('Cote')) {
        const suggested = key.match(/^Cote suggérée \((\d+-\d+)\)$/)
        if (suggested) parsed.suggestedScore = suggested[1]
        parsed.odds.push({ label: suggested ? 'Cote' : key, value })
      }
    }
  }

  return parsed
}

/**
 * Décision affichée pour un match suivi : niveau de son alerte active la plus forte, sinon l'état connu
 * (vitalité sous le minimum réglé = abstention, sinon surveillance). Toujours un libellé, jamais la couleur seule.
 */
export function trackedMatchDecision(match, parsedAlerts, minimumVitality = 41) {
  const name = `${match.homeTeam} - ${match.awayTeam}`
  const alerts = parsedAlerts
    .filter((alert) => alert.matchName === name && alert.parsed)
    .sort((left, right) => LEVEL_SEVERITY.indexOf(left.parsed.level) - LEVEL_SEVERITY.indexOf(right.parsed.level))

  if (alerts.length) return { tone: alerts[0].parsed.level, label: alerts[0].parsed.label }
  if (!match.capturedAt) return { tone: 'watch', label: 'En attente du premier relevé' }
  if (match.vitality === null || match.vitality === undefined) return { tone: 'dead', label: 'Vitalité non calculable · abstention' }
  if (Number(match.vitality) < minimumVitality) return { tone: 'dead', label: 'Match mort · abstention' }

  return { tone: 'watch', label: 'Surveillance' }
}

/**
 * Quota API restant d'après le dernier relevé des en-têtes du fournisseur (cotes, sinon football).
 */
export function quotaSummary(providerStatus) {
  // Football et cotes partagent le même quota de compte API-Football : le restant affiché est le plus bas (relevé le
  // plus récent), la limite est celle du jour envoyée par le fournisseur (en-tête x-ratelimit-requests-limit).
  const statuses = [providerStatus?.odds, providerStatus?.football].filter(Boolean)
  const remainings = statuses.map((status) => status.requestsRemaining).filter((value) => typeof value === 'number')
  if (!remainings.length) return { remaining: null, limit: null, percent: null }

  const remaining = Math.min(...remainings)
  const limits = statuses.map((status) => status.requestsLimit).filter((value) => typeof value === 'number' && value > 0)
  const limit = limits.length ? Math.max(...limits) : null
  const percent = limit ? Math.round((remaining / limit) * 100) : null

  return { remaining, limit, percent }
}

/**
 * Durée écoulée lisible (« il y a 12 s »), à partir d'une date ISO et de l'heure courante en millisecondes.
 */
export function elapsedLabel(value, now) {
  if (!value) return 'aucun relevé'
  if (!now) return '…'
  const seconds = Math.max(0, Math.floor((now - Date.parse(value)) / 1000))
  if (seconds < 60) return `il y a ${seconds} s`
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`

  return `il y a ${Math.floor(seconds / 86400)} j`
}

// Statuts API-Football (libellés longs renvoyés par fixtures?live=all, codes courts et statuts du pilote fictif).
const MATCH_STATUSES = [
  [['first half', 'first half, kick off', '1h'], '1re MT', true],
  [['halftime', 'ht'], 'Mi-temps', false],
  [['second half', 'second half, 2nd half started', '2h'], '2e MT', true],
  [['extra time', 'et'], 'Prolongation', true],
  [['break time', 'bt'], 'Pause avant prolongation', false],
  [['penalty in progress', 'p'], 'Tirs au but', false],
  [['match suspended', 'susp'], 'Suspendu', false],
  [['match interrupted', 'int'], 'Interrompu', false],
  [['match finished', 'ft', 'finished'], 'Terminé', false],
  [['match finished after extra time', 'aet'], 'Terminé après prolongation', false],
  [['match finished after penalty', 'pen'], 'Terminé aux tirs au but', false],
  [['match postponed', 'pst'], 'Reporté', false],
  [['match cancelled', 'canc'], 'Annulé', false],
  [['match abandoned', 'abd'], 'Abandonné', false],
  [['technical loss', 'awd'], 'Défaite technique', false],
  [['walkover', 'wo'], 'Forfait', false],
  [['in progress', 'live'], 'En cours', true],
  [['not started', 'ns', 'upcoming'], 'À venir', false],
  [['time to be defined', 'tbd'], 'Horaire à définir', false],
]

/**
 * État d'un match en français, avec la minute pour les phases de jeu : « 1re MT · 6' », « Mi-temps », « Terminé ».
 */
export function matchStatusLabel(status, minute) {
  const key = String(status ?? '').trim().toLowerCase()
  const known = MATCH_STATUSES.find(([names]) => names.includes(key))
  const label = known ? known[1] : (String(status ?? '').trim() || 'État inconnu')
  const withMinute = (known ? known[2] : true) && typeof minute === 'number'

  return withMinute ? `${label} · ${minute}'` : label
}

/**
 * Raison pour laquelle un match ne peut pas être suivi, ou null s'il peut l'être.
 */
export function unavailableReason(match, quotaRemaining, allowWithoutStatistics = true) {
  if (match.tracked) return null
  const reasons = []
  if (!match.exactScoreMarketAvailable) reasons.push('cotes de score exact non disponibles pour ce match')
  if (match.statisticsCoverage === false && !allowWithoutStatistics) reasons.push('statistiques non couvertes pour cette compétition')
  if (quotaRemaining === 0) reasons.push('quota API épuisé')
  if (!reasons.length) return null

  const text = reasons.join(' ; ')
  return `${text[0].toUpperCase()}${text.slice(1)}.`
}

// Noms affichés des championnats suivis par défaut (identifiants API-Football).
const LEAGUE_NAMES = {
  39: ['premier-league', 'Premier League'],
  140: ['liga', 'Liga'],
  135: ['serie-a', 'Serie A'],
  78: ['bundesliga', 'Bundesliga'],
  61: ['ligue-1', 'Ligue 1'],
  2: ['ligue-des-champions', 'Ligue des champions'],
  3: ['europa-league', 'Europa League'],
}

export const DEFAULT_TRACKED_LEAGUE_IDS = [39, 140, 135, 78, 61, 2, 3]

/**
 * Pastilles du filtre par championnat : « Tous » (championnats suivis), un par championnat suivi, « Autres ».
 * Chaque pastille a une clé stable, utilisée dans l'URL (?ligue=).
 */
export function leagueFilters(leagueIds = DEFAULT_TRACKED_LEAGUE_IDS) {
  const ids = leagueIds.map(Number).filter(Number.isFinite)

  return [
    { key: 'tous', label: 'Tous', leagueIds: ids },
    ...ids.map((id) => ({ key: LEAGUE_NAMES[id]?.[0] ?? `ligue-${id}`, label: LEAGUE_NAMES[id]?.[1] ?? `Ligue ${id}`, leagueIds: [id] })),
    { key: 'autres', label: 'Autres', leagueIds: null, excludedLeagueIds: ids },
  ]
}

function matchesLeagueFilter(match, filter) {
  const leagueId = Number(match.leagueId)
  if (filter.leagueIds === null) return !filter.excludedLeagueIds.includes(leagueId)

  return filter.leagueIds.includes(leagueId)
}

/**
 * Nombre de matchs du flux en direct par pastille (indépendant de la recherche).
 */
export function leagueFilterCounts(matches, filters) {
  return Object.fromEntries(filters.map((filter) => [filter.key, matches.filter((match) => matchesLeagueFilter(match, filter)).length]))
}

/**
 * Clé de pastille valide à partir du paramètre ?ligue= de l'URL ; « tous » par défaut.
 */
export function leagueFilterFromUrl(search, filters) {
  const value = new URLSearchParams(search).get('ligue')

  return filters.some((filter) => filter.key === value) ? value : 'tous'
}

function normalizeSearch(text) {
  return String(text ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/**
 * Rencontres à afficher : championnat choisi (« Tous » = championnats suivis, « Autres » = le reste), recherche sur
 * les équipes et la compétition, puis matchs suivis ou en alerte d'abord, et minute la plus avancée d'abord.
 */
export function availableMatchesView(matches, { leagueIds = DEFAULT_TRACKED_LEAGUE_IDS, league = 'tous', query = '', alertMatchNames = [] } = {}) {
  const filters = leagueFilters(leagueIds)
  const filter = filters.find((candidate) => candidate.key === league) ?? filters[0]
  const alerts = new Set(alertMatchNames)
  const search = normalizeSearch(query.trim())
  const priority = (match) => (match.tracked || alerts.has(`${match.homeTeam} - ${match.awayTeam}`) ? 0 : 1)
  const minute = (match) => (typeof match.minute === 'number' ? match.minute : -1)

  return matches
    .filter((match) => matchesLeagueFilter(match, filter))
    .filter((match) => search === '' || normalizeSearch(`${match.homeTeam} ${match.awayTeam} ${match.competition}`).includes(search))
    .sort((left, right) => priority(left) - priority(right) || minute(right) - minute(left))
}

/**
 * Pastille réellement affichée : si l'administrateur n'a pas choisi de championnat et qu'aucun match des
 * championnats suivis n'est en direct, « Autres » s'ouvre à la place de « Tous » (vide).
 */
export function effectiveLeagueFilter(selected, chosen, counts) {
  if (chosen || selected !== 'tous') return selected

  return counts.tous === 0 && counts.autres > 0 ? 'autres' : 'tous'
}

/**
 * Le paramètre ?ligue= désigne-t-il un choix explicite de l'administrateur (et non « auto ») ?
 */
export function leagueChosenInUrl(search, filters) {
  const value = new URLSearchParams(search).get('ligue')

  return value !== null && value !== 'auto' && filters.some((filter) => filter.key === value)
}

/**
 * État du scan affiché : « Scan automatique », « Scan manuel » ou « Scan en pause ».
 */
export function scanModeLabel(scanMode) {
  if (!scanMode) return 'État du scan…'
  if (scanMode.paused) return 'Scan en pause'

  return scanMode.mode === 'manual' ? 'Scan manuel' : 'Scan automatique'
}

/**
 * Matchs à venir : même filtre par championnat et même recherche que les matchs en direct ; ordre du serveur
 * (heure de coup d’envoi) conservé.
 */
export function upcomingMatchesView(matches, { leagueIds = DEFAULT_TRACKED_LEAGUE_IDS, league = 'tous', query = '' } = {}) {
  const filters = leagueFilters(leagueIds)
  const filter = filters.find((candidate) => candidate.key === league) ?? filters[0]
  const search = normalizeSearch(query.trim())

  return matches
    .filter((match) => matchesLeagueFilter(match, filter))
    .filter((match) => search === '' || normalizeSearch(`${match.homeTeam} ${match.awayTeam} ${match.competition}`).includes(search))
}

export const OPTION_TYPE_LABELS = {
  targeted: 'Ciblée',
  neutral: 'Neutre',
  over45: 'Over 4.5 (F121-D)',
  halftime_over05: 'Over 0.5 2e MT (F121-E2)',
  plancher_central: 'Plancher central',
  plancher_prudent: 'Plancher prudent',
}

export const PLANCHER_SCAN_LABELS = { depart: 'départ', pause: 'pause (E2)', soixante: 'soixante' }

const formatOdds = (value) => {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return null
  const text = Number(value).toFixed(3)
  return text.endsWith('0') ? text.slice(0, -1) : text
}

/**
 * Scan Plancher du Journal : textes prêts à afficher (scan, liste ≤ 8.00, total_max, plancher, paris et cotes,
 * « valeur faible », paris écartés, Under 2.5, Under de la ligne total_max + 0.5, signal E2 d’origine).
 */
export function plancherSummary(plancher) {
  if (!plancher) return null
  const limit = formatOdds(plancher.scoreOddsLimit ?? 8)
  const list = plancher.list ?? []
  const floor = plancher.floor
  const underAbove = plancher.underAboveTotalMax
  const e2 = plancher.e2Signal

  return {
    title: `Mode ${plancher.mode ?? 'Plancher'} · scan ${PLANCHER_SCAN_LABELS[plancher.scan] ?? plancher.scan}`,
    moment: [plancher.minute === null || plancher.minute === undefined ? null : `${plancher.minute}'`, plancher.score].filter(Boolean).join(' · '),
    list: list.length ? `Liste ≤ ${limit} : ${list.map((item) => item.score).join(', ')}` : `Liste ≤ ${limit} : aucun score atteignable`,
    listLabel: `Liste ≤ ${limit}`,
    scores: list.map((item) => item.score),
    floor: plancher.totalMax === null || plancher.totalMax === undefined ? null : `total_max ${plancher.totalMax} · Plancher ${floor > 0 ? '+' : ''}${floor} but${Math.abs(floor) > 1 ? 's' : ''}`,
    bets: (plancher.proposals ?? []).map((bet) => ({
      key: bet.type,
      label: bet.type === 'central' ? 'Pari central' : 'Pari prudent',
      text: `${bet.bet} @${formatOdds(bet.odds)}`,
      lowValue: bet.lowValue === true,
    })),
    skipped: (plancher.skipped ?? []).map((bet) => `${bet.bet} : ${bet.reason}`),
    unders: [
      plancher.under25 === null || plancher.under25 === undefined ? null : `Under 2.5 : ${formatOdds(plancher.under25)}`,
      underAbove?.odds ? `Under ${underAbove.line} : ${formatOdds(underAbove.odds)}` : null,
      e2 ? `Signal E2 d’origine : ${e2.inBand ? 'oui' : 'non'} (${formatOdds(e2.minimum)} à ${formatOdds(e2.maximum)}, sans décider)` : null,
    ].filter(Boolean).join(' · '),
    notified: plancher.notified === true,
  }
}

export const OPTION_DECISIONS = [['unset', 'Non renseignée'], ['played', 'Jouée'], ['ignored', 'Ignorée']]

export const OPTION_OUTCOMES = [['pending', 'En attente'], ['won', 'Gagnée'], ['lost', 'Perdue'], ['cancelled', 'Annulée']]

/**
 * Lignes « règle × type d’option » des statistiques, avec le taux sur toutes les options et sur les seules jouées.
 */
export function statisticsOptionRows(byRule) {
  return Object.entries(byRule ?? {}).flatMap(([rule, data]) => Object.entries(data.byType ?? {}).map(([type, block]) => ({
    key: `${rule}-${type}`,
    rule,
    type,
    label: OPTION_TYPE_LABELS[type] ?? type,
    ...block,
  })))
}

/**
 * Taux d’une origine de résultats (automatique ou notée à la main) : « 41,8 % (74 / 177) », ou « — » sans résultat.
 */
export function sourceRate(block) {
  const won = block?.won ?? 0
  const total = won + (block?.lost ?? 0)
  if (total === 0) return '—'
  return `${((won / total) * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} % (${won} / ${total})`
}

export const CONFIDENCE_RULES = ['F121-E1', 'F121-C', 'F162-Bis', 'F121-D', 'F121-E2', 'F121-C.2']

/** Score de confiance automatique (V12) : libellé court, ou null si l’évaluation n’en a pas. */
export function confidenceSummary(confidence) {
  if (!confidence) return null
  if (confidence.score === null || confidence.score === undefined) return 'Non calculé'
  const format = (value) => Number(value).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${format(confidence.score)} %${confidence.threshold === undefined || confidence.threshold === null ? '' : ` (seuil ${format(confidence.threshold)} %)`}`
}
