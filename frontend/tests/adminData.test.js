import assert from 'node:assert/strict'
import test from 'node:test'
import { createRuleTestPayload, parseCorrectScoreOdds } from '../src/adminData.js'

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
  }

  assert.deepEqual(createRuleTestPayload(fields), {
    home_score: 0,
    away_score: 0,
    exact_score_odds: { '0-0': 7.5, '1-0': 8.6, '0-1': 9.8 },
    vitality_score: 61,
    odds_change_percent: -1,
  })
  assert.throws(() => createRuleTestPayload({ ...fields, oddsText: '0-0=7.5' }), /cote du score 1-0 est nécessaire/)
  assert.throws(() => createRuleTestPayload({ ...fields, homeScore: '-1' }), /scores doivent être/)
  assert.throws(() => createRuleTestPayload({ ...fields, vitalityScore: '101' }), /vitalité doit être/)
  assert.throws(() => createRuleTestPayload({ ...fields, oddsChangePercent: 'stable' }), /variation des cotes/)
})
