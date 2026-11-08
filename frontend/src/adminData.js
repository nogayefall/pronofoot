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

export function createRuleTestPayload({ homeScore, awayScore, oddsText, vitalityScore, oddsChangePercent }) {
  const parsedHomeScore = Number(homeScore)
  const parsedAwayScore = Number(awayScore)
  const parsedVitality = Number(vitalityScore)
  const parsedOddsChange = Number(oddsChangePercent)

  if (!Number.isInteger(parsedHomeScore) || parsedHomeScore < 0
    || !Number.isInteger(parsedAwayScore) || parsedAwayScore < 0) {
    throw new Error('Les scores doivent être des nombres entiers positifs ou nuls.')
  }

  if (!Number.isFinite(parsedVitality) || parsedVitality < 0 || parsedVitality > 100) {
    throw new Error('La vitalité doit être comprise entre 0 et 100.')
  }

  if (!Number.isFinite(parsedOddsChange)) {
    throw new Error('La variation des cotes sur deux minutes doit être un nombre valide.')
  }

  const exactScoreOdds = parseCorrectScoreOdds(oddsText)
  const requiredScores = [
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
  }
}
