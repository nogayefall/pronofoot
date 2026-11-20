import assert from 'node:assert/strict'
import test from 'node:test'
import { createRuleTestPayload, parseCorrectScoreOdds, teamStatisticsRows, journalDecisionLabel, parseAlertMessage, trackedMatchDecision, quotaSummary, elapsedLabel } from '../src/adminData.js'

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
