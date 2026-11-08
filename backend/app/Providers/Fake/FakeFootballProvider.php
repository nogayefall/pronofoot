<?php

namespace App\Providers\Fake;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;

final class FakeFootballProvider implements FootballProvider
{
    public function __construct(private readonly FakeFixtureLoader $fixtures) {}

    public function getLiveMatches(int $scanNumber = 0): FootballFeed
    {
        $fixture = $this->fixtures->load();
        $matches = [];

        foreach ($fixture['matches'] as $match) {
            $timeline = $match['timeline'] ?? null;
            if (! is_array($timeline) || $timeline === []) {
                continue;
            }

            $snapshot = $timeline[min(max($scanNumber, 0), count($timeline) - 1)];
            $data = $snapshot['football'] ?? null;
            if (! is_array($data) || ($data['status'] ?? null) !== 'live') {
                continue;
            }

            $statistics = $data['statistics'] ?? [];
            $matches[] = new FootballMatch(
                providerMatchId: (string) $match['id'],
                homeTeam: (string) ($match['home_team'] ?? 'Équipe domicile fictive'),
                awayTeam: (string) ($match['away_team'] ?? 'Équipe extérieure fictive'),
                status: (string) $data['status'],
                scenario: (string) ($match['scenario'] ?? ''),
                competition: $match['competition'] ?? null,
                kickoffAt: $match['kickoff_at'] ?? null,
                minute: isset($data['minute']) ? (int) $data['minute'] : null,
                homeScore: isset($data['home_score']) ? (int) $data['home_score'] : null,
                awayScore: isset($data['away_score']) ? (int) $data['away_score'] : null,
                statistics: is_array($statistics) ? $statistics : [],
                vitalityScore: is_numeric($data['vitality_score'] ?? null) ? (float) $data['vitality_score'] : null,
                oddsChangePercent: is_numeric($data['odds_change_percent'] ?? null) ? (float) $data['odds_change_percent'] : null,
            );
        }

        $requiredStatistics = ['shots', 'shots_on_target', 'possession', 'corners'];
        $statisticsAvailable = collect($matches)->contains(
            fn (FootballMatch $match): bool => count(array_intersect($requiredStatistics, array_keys($match->statistics))) === count($requiredStatistics),
        );

        return new FootballFeed(
            driver: 'fake',
            reachable: true,
            statisticsAvailable: $statisticsAvailable,
            statusMessage: 'Simulation : données issues des scénarios fictifs déterministes.',
            matches: $matches,
            requestsUsed: 0,
            rawResponse: $this->fixtures->raw(),
        );
    }
}
