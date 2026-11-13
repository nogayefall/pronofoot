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
  if (decision === 'no_alert') {
    return eventType === 'evaluation' ? 'Abstention' : (JOURNAL_INCIDENTS[eventType] ?? 'Incident')
  }

  return JOURNAL_DECISIONS[decision] ?? decision
}
