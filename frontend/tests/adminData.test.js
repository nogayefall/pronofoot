import assert from 'node:assert/strict'
import test from 'node:test'
import { createRuleTestPayload, parseCorrectScoreOdds, teamStatisticsRows, journalDecisionLabel, parseAlertMessage, trackedMatchDecision, quotaSummary, elapsedLabel, matchStatusLabel, unavailableReason, availableMatchesView, leagueFilters, leagueFilterCounts, leagueFilterFromUrl, effectiveLeagueFilter, leagueChosenInUrl, scanModeLabel } from '../src/adminData.js'

test('parseCorrectScoreOdds reads decimal comma and dot formats', () => {
  assert.deepEqual(parseCorrectScoreOdds('0-0 = 7,50\n1-0 : 8.60\n0-1 = 9,80'), {
    '0-0': 7.5,
    '1-0': 8.6,
    '0-1': 9.8,
  })
})

test('parseCorrectScoreOdds rejects duplicate scores, malformed lines and non-positive odds', () => {
  assert.throws(() => parseCorrectScoreOdds('0-0 = 7.5\n0-0 = 8.5'), /apparaît plusieurs fois/)
  assert.throws(() => parseCorrectScoreOdds('invalid'), /Format incorrect/)
  assert.throws(() => parseCorrectScoreOdds('0-0 = 0'), /supérieure à zéro/)
})

test('createRuleTestPayload validates the score, vitality and required correct-score odds', () => {
  const fields = {
    homeScore: '0',
    awayScore: '0',
    oddsText: '0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80',
    vitalityScore: '61',
    oddsChangePercent: '-1',
    tendanceSource: 'cote_suggeree',
    tendanceSeuilStable: '3',
  }

  assert.deepEqual(createRuleTestPayload(fields), {
    home_score: 0,
    away_score: 0,
    exact_score_odds: { '0-0': 7.5, '1-0': 8.6, '0-1': 9.8 },
    vitality_score: 61,
    odds_change_percent: -1,
    tendance_source: 'cote_suggeree',
    tendance_seuil_stable: 3,
    halftime: false,
    under_2_5_odds: null,
  })
  assert.equal(createRuleTestPayload({ ...fields, vitalityScore: '', oddsChangePercent: '' }).vitality_score, null)
  assert.deepEqual(
    createRuleTestPayload({ ...fields, oddsText: '', halftime: true, under25Odds: '1.36' }).under_2_5_odds,
    1.36,
  )
  assert.throws(() => createRuleTestPayload({ ...fields, under25Odds: '0' }), /Under 2.5/)
  assert.throws(() => createRuleTestPayload({ ...fields, oddsText: '0-0=7.5' }), /cote du score 1-0 est nécessaire/)
  assert.throws(() => createRuleTestPayload({ ...fields, homeScore: '-1' }), /scores doivent être/)
  assert.throws(() => createRuleTestPayload({ ...fields, vitalityScore: '101' }), /vitalité doit être/)
  assert.throws(() => createRuleTestPayload({ ...fields, oddsChangePercent: 'stable' }), /variation des cotes/)
})

test('teamStatisticsRows formats raw team statistics and never turns missing values into zero', () => {
  assert.deepEqual(teamStatisticsRows({
    home: { shots: 5, shots_on_target: 3, corners: 0, possession: 40 },
    away: { shots: 9, shots_on_target: null, possession: 60 },
  }), [
    { key: 'shots', label: 'Tirs', home: '5', away: '9' },
    { key: 'shots_on_target', label: 'Tirs cadrés', home: '3', away: 'Non disponible' },
    { key: 'corners', label: 'Corners', home: '0', away: 'Non disponible' },
    { key: 'possession', label: 'Possession', home: '40 %', away: '60 %' },
  ])
  assert.deepEqual(teamStatisticsRows(null), [])
})

test('journalDecisionLabel shows French labels instead of internal codes', () => {
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'evaluation' }), 'Abstention')
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'odds_data_missing' }), 'Incident : cotes du match manquantes')
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'inconnu' }), 'Incident')
  assert.equal(journalDecisionLabel({ decision: 'duplicate_suppressed', eventType: 'evaluation' }), 'Doublon évité')
  assert.equal(journalDecisionLabel({ decision: 'reevaluate', eventType: 'goal_detected' }), 'But détecté')
  assert.equal(journalDecisionLabel({ decision: 'alert', eventType: 'evaluation' }), 'Alerte')
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'scan_paused' }), 'Pas de scan (écart trop grand)')
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'scan_resumed' }), 'Scan repris')
})

const CRITICAL_MESSAGE = [
  'ALERTE CRITIQUE · valable jusqu’à 21:15',
  "Arsenal - Everton  1-0  63'",
  'Prochain but : Arsenal',
  'Cote suggérée (2-0) : 2.50 | Écart : -0.12',
  'Vitalité : 72/100 | Tendance : -6.0 %',
  'Règle : F121-E1',
  'Signal de détection, sans garantie de gain. Aucun pari n’est placé.',
].join('\n')

test('parseAlertMessage reads the level, match, suggested score, odds and gap of a real alert message', () => {
  const parsed = parseAlertMessage(CRITICAL_MESSAGE)

  assert.equal(parsed.level, 'critical')
  assert.equal(parsed.label, 'Alerte Critique')
  assert.equal(parsed.validUntil, '21:15')
  assert.equal(parsed.match, 'Arsenal - Everton')
  assert.equal(parsed.score, '1-0')
  assert.equal(parsed.minute, 63)
  assert.equal(parsed.target, 'Arsenal')
  assert.equal(parsed.suggestedScore, '2-0')
  assert.deepEqual(parsed.odds, [{ label: 'Cote', value: '2.50' }])
  assert.equal(parsed.gap, '-0.12')
  assert.equal(parsed.vitality, 72)
  assert.equal(parsed.trend, '-6.0 %')
  assert.equal(parsed.rule, 'F121-E1')
})

test('parseAlertMessage handles bets without a target, unknown scores and renamed levels', () => {
  const neutral = parseAlertMessage(['PARI NEUTRE · valable jusqu’à 22:40', 'Lens - Nantes  ?-?', 'Pari : Over 4.5', 'Cote 3-2 : 7.80 | Cote 2-3 : 8.00', 'Règle : F121-D | Confiance : 80 %'].join('\n'))
  assert.equal(neutral.level, 'neutral')
  assert.equal(neutral.score, null)
  assert.equal(neutral.minute, null)
  assert.equal(neutral.bet, 'Over 4.5')
  assert.equal(neutral.suggestedScore, null)
  assert.deepEqual(neutral.odds, [{ label: 'Cote 3-2', value: '7.80' }, { label: 'Cote 2-3', value: '8.00' }])
  assert.equal(neutral.confidence, '80 %')

  const renamed = parseAlertMessage("ALERTE ROUGE · valable jusqu’à 9:05\nA - B  0-0  12'\nÉcart : n.c.")
  assert.equal(renamed.level, 'other')
  assert.equal(renamed.label, 'Alerte Rouge')
  assert.equal(renamed.gap, null)

  assert.equal(parseAlertMessage('TEST PRONOFOOT\nLe canal fonctionne.'), null)
  assert.equal(parseAlertMessage(''), null)
})

test('trackedMatchDecision shows the strongest active alert, otherwise the vitality state, always with a label', () => {
  const match = { homeTeam: 'Arsenal', awayTeam: 'Everton', capturedAt: '2026-11-20T20:00:00+00:00', vitality: 72 }
  const alerts = [
    { matchName: 'Arsenal - Everton', parsed: { level: 'high', label: 'Alerte Haute' } },
    { matchName: 'Arsenal - Everton', parsed: { level: 'critical', label: 'Alerte Critique' } },
    { matchName: 'Inter - Torino', parsed: { level: 'critical', label: 'Alerte Critique' } },
  ]

  assert.deepEqual(trackedMatchDecision(match, alerts), { tone: 'critical', label: 'Alerte Critique' })
  assert.deepEqual(trackedMatchDecision(match, []), { tone: 'watch', label: 'Surveillance' })
  assert.deepEqual(trackedMatchDecision({ ...match, vitality: 40 }, []), { tone: 'dead', label: 'Match mort · abstention' })
  assert.deepEqual(trackedMatchDecision({ ...match, vitality: 41 }, []), { tone: 'watch', label: 'Surveillance' })
  assert.deepEqual(trackedMatchDecision({ ...match, vitality: 45 }, [], 50), { tone: 'dead', label: 'Match mort · abstention' })
  assert.deepEqual(trackedMatchDecision({ ...match, vitality: null }, []), { tone: 'dead', label: 'Vitalité non calculable · abstention' })
  assert.deepEqual(trackedMatchDecision({ ...match, capturedAt: null }, []), { tone: 'watch', label: 'En attente du premier relevé' })
})

test('quotaSummary and elapsedLabel describe the real provider quota and scan freshness', () => {
  assert.deepEqual(quotaSummary({ odds: { requestsUsed: 1020, requestsRemaining: 6480 } }), { remaining: 6480, limit: 7500, percent: 86 })
  assert.deepEqual(quotaSummary({ football: { requestsRemaining: 90 } }), { remaining: 90, limit: null, percent: null })
  assert.deepEqual(quotaSummary({}), { remaining: null, limit: null, percent: null })

  const now = Date.parse('2026-11-20T10:00:30Z')
  assert.equal(elapsedLabel('2026-11-20T10:00:18Z', now), 'il y a 12 s')
  assert.equal(elapsedLabel('2026-11-20T09:57:30Z', now), 'il y a 3 min')
  assert.equal(elapsedLabel(null, now), 'aucun relevé')
})

test('matchStatusLabel translates every API-Football status and adds the minute only while the ball is in play', () => {
  assert.equal(matchStatusLabel('First Half', 6), "1re MT · 6'")
  assert.equal(matchStatusLabel('First Half, Kick Off', 6), "1re MT · 6'")
  assert.equal(matchStatusLabel('Second Half', 63), "2e MT · 63'")
  assert.equal(matchStatusLabel('Halftime', 45), 'Mi-temps')
  assert.equal(matchStatusLabel('Match Finished', 90), 'Terminé')
  assert.equal(matchStatusLabel('Extra Time', 97), "Prolongation · 97'")
  assert.equal(matchStatusLabel('Penalty In Progress', 120), 'Tirs au but')
  assert.equal(matchStatusLabel('Match Postponed', null), 'Reporté')
  assert.equal(matchStatusLabel('WalkOver', null), 'Forfait')
  assert.equal(matchStatusLabel('In Progress', null), 'En cours')
  assert.equal(matchStatusLabel('2H', 70), "2e MT · 70'")
  assert.equal(matchStatusLabel('live', 12), "En cours · 12'")
  assert.equal(matchStatusLabel('upcoming', null), 'À venir')
  assert.equal(matchStatusLabel('Statut inédit', 30), "Statut inédit · 30'")
})

test('unavailableReason explains why a match cannot be tracked', () => {
  assert.equal(unavailableReason({ tracked: false, exactScoreMarketAvailable: true, statisticsCoverage: true }, 100), null)
  assert.equal(unavailableReason({ tracked: true, exactScoreMarketAvailable: false }, 0), null)
  assert.equal(unavailableReason({ tracked: false, exactScoreMarketAvailable: false, statisticsCoverage: true }, 100), 'Cotes de score exact non disponibles pour ce match.')
  assert.equal(unavailableReason({ tracked: false, exactScoreMarketAvailable: true, statisticsCoverage: false }, 0, false), 'Statistiques non couvertes pour cette compétition ; quota API épuisé.')
  assert.equal(unavailableReason({ tracked: false, exactScoreMarketAvailable: true, statisticsCoverage: false }, 100), null, 'Suivi sans statistiques autorisé par défaut.')
  assert.equal(unavailableReason({ tracked: false, exactScoreMarketAvailable: false, statisticsCoverage: false }, 100), 'Cotes de score exact non disponibles pour ce match.')
})

const LIVE_MATCHES = [
  { providerMatchId: 1, homeTeam: 'Van', awayTeam: 'Ararat-Armenia', competition: 'Premier League · Armenia', leagueId: 342, minute: 8, tracked: false },
  { providerMatchId: 2, homeTeam: 'Arsenal', awayTeam: 'Everton', competition: 'Premier League · England', leagueId: 39, minute: 20, tracked: false },
  { providerMatchId: 3, homeTeam: 'Lens', awayTeam: 'Nantes', competition: 'Ligue 1 · France', leagueId: 61, minute: 70, tracked: false },
  { providerMatchId: 4, homeTeam: 'Atlético', awayTeam: 'Getafe', competition: 'La Liga · Spain', leagueId: 140, minute: 10, tracked: true },
  { providerMatchId: 5, homeTeam: 'Zira', awayTeam: 'Imisli', competition: 'Premyer Liqa · Azerbaijan', leagueId: 419, minute: 37, tracked: true },
  { providerMatchId: 6, homeTeam: 'Chelsea', awayTeam: 'Fulham', competition: 'Premier League · England', leagueId: 39, minute: 75, tracked: false },
]
const ids = (matches) => matches.map((match) => match.providerMatchId)

test('leagueFilters builds Tous, one chip per tracked league and Autres, with live counts including empty leagues', () => {
  const filters = leagueFilters()

  assert.deepEqual(filters.map((filter) => filter.label), ['Tous', 'Premier League', 'Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Ligue des champions', 'Europa League', 'Autres'])
  assert.deepEqual(leagueFilterCounts(LIVE_MATCHES, filters), {
    tous: 4,
    'premier-league': 2,
    liga: 1,
    'serie-a': 0,
    bundesliga: 0,
    'ligue-1': 1,
    'ligue-des-champions': 0,
    'europa-league': 0,
    autres: 2,
  })
  assert.deepEqual(leagueFilters([39, 999]).map((filter) => filter.key), ['tous', 'premier-league', 'ligue-999', 'autres'])
})

test('availableMatchesView filters by league chip, combines with the search and keeps tracked or alerted matches first, then by minute', () => {
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES)), [4, 6, 3, 2], 'Tous : les championnats suivis seulement, la Premier League arménienne exclue')
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'premier-league' })), [6, 2])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'autres' })), [5, 1])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'serie-a' })), [])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'premier-league', alertMatchNames: ['Arsenal - Everton'] })), [2, 6])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'premier-league', query: 'everton' })), [2])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'autres', query: 'premier league' })), [1])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'tous', query: 'atletico' })), [4])
  assert.deepEqual(ids(availableMatchesView(LIVE_MATCHES, { league: 'inconnu' })), [4, 6, 3, 2], 'Clé inconnue : retour à « Tous »')
})

test('leagueFilterFromUrl reads ?ligue= and falls back to Tous', () => {
  const filters = leagueFilters()

  assert.equal(leagueFilterFromUrl('?ligue=ligue-1', filters), 'ligue-1')
  assert.equal(leagueFilterFromUrl('?page=matches&ligue=autres', filters), 'autres')
  assert.equal(leagueFilterFromUrl('?ligue=n-importe-quoi', filters), 'tous')
  assert.equal(leagueFilterFromUrl('', filters), 'tous')
})

test('effectiveLeagueFilter opens Autres when Tous is empty, unless the administrator chose a league', () => {
  assert.equal(effectiveLeagueFilter('tous', false, { tous: 0, autres: 15 }), 'autres')
  assert.equal(effectiveLeagueFilter('tous', false, { tous: 3, autres: 15 }), 'tous')
  assert.equal(effectiveLeagueFilter('tous', false, { tous: 0, autres: 0 }), 'tous')
  assert.equal(effectiveLeagueFilter('tous', true, { tous: 0, autres: 15 }), 'tous')
  assert.equal(effectiveLeagueFilter('ligue-1', false, { tous: 0, autres: 15 }), 'ligue-1')

  const filters = leagueFilters()
  assert.equal(leagueChosenInUrl('?ligue=tous', filters), true)
  assert.equal(leagueChosenInUrl('?ligue=auto', filters), false)
  assert.equal(leagueChosenInUrl('?ligue=inconnu', filters), false)
  assert.equal(leagueChosenInUrl('', filters), false)
})

test('journalDecisionLabel names the match end and the penalty shootout', () => {
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'match_finished' }), 'Match terminé : suivi arrêté')
  assert.equal(journalDecisionLabel({ decision: 'no_alert', eventType: 'penalty_shootout' }), 'Tirs au but : pas d’analyse')
})

test('parseAlertMessage reads the two options and the missing vitality note', () => {
  const parsed = parseAlertMessage([
    'ALERTE CRITIQUE · valable jusqu’à 21:15',
    "Grimsby - Cheltenham  1-1  68'",
    'Prochain but : Grimsby',
    'Cote suggérée (2-1) : 3.10 | Écart : -0.09',
    'Option 1 (ciblée) : prochain but Grimsby — score 2-1, cote 3.10, écart -0.09',
    'Option 2 (neutre) : un but de plus dans le match — Over 2.5, cote non disponible',
    'Aucune option n’est jouée automatiquement.',
    'Vitalité : non disponible (statistiques non couvertes) | Tendance : stable',
    'Règle : F121-E1',
  ].join('\n'))

  assert.deepEqual(parsed.options.map((option) => option.label), ['Option 1 (ciblée)', 'Option 2 (neutre)'])
  assert.equal(parsed.options[1].text, 'un but de plus dans le match — Over 2.5, cote non disponible')
  assert.equal(parsed.vitality, null)
  assert.equal(parsed.vitalityNote, 'Vitalité non disponible (statistiques non couvertes)')
})

test('scanModeLabel shows automatic, manual or paused', () => {
  assert.equal(scanModeLabel({ mode: 'auto', paused: false }), 'Scan automatique')
  assert.equal(scanModeLabel({ mode: 'manual', paused: false }), 'Scan manuel')
  assert.equal(scanModeLabel({ mode: 'manual', paused: true }), 'Scan en pause')
  assert.equal(scanModeLabel(null), 'État du scan…')
})
