import assert from 'node:assert/strict'
import test from 'node:test'
import { createRuleTestPayload, parseCorrectScoreOdds, teamStatisticsRows, journalDecisionLabel } from '../src/adminData.js'

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
