<?php

namespace App\Providers\Fake;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;

final class FakeFootballProvider implements FootballProvider
{
    public function __construct(private readonly FakeFixtureLoader $fixtures) {}

    public function getLiveMatches(
        int $scanNumber = 0,
        bool $includeStatistics = true,
        ?int $statisticsMatchLimit = 1,
        bool $includeCoverage = false,
        ?array $statisticsMatchIds = null,
        ?int $quotaAlertThreshold = null,
        ?array $coverageLeagueIds = null,
    ): FootballFeed {
        $fixture = $this->fixtures->load();
        $matches = [];

        foreach ($fixture['matches'] as $match) {
            $timeline = $match['timeline'] ?? null;
            if (! is_array($timeline) || $timeline === []) {
                continue;
            }

            $snapshot = $timeline[min(max($scanNumber, 0), count($timeline) - 1)];
            $data = $snapshot['football'] ?? null;
            if (! is_array($data) || ! in_array($data['status'] ?? null, ['live', 'halftime', 'upcoming'], true)) {
                continue;
            }

            $statisticsRequested = $includeStatistics
                && ($statisticsMatchIds === null || in_array((string) $match['id'], $statisticsMatchIds, true));
            $statistics = $statisticsRequested ? ($data['statistics'] ?? []) : [];
            $coverageStatistics = is_array($data['statistics'] ?? null) ? $data['statistics'] : [];
            $matches[] = new FootballMatch(
                providerMatchId: (string) $match['id'],
                homeTeam: (string) ($match['home_team'] ?? 'Équipe domicile fictive'),
                awayTeam: (string) ($match['away_team'] ?? 'Équipe extérieure fictive'),
                status: $data['status'] === 'halftime' ? 'Halftime' : (string) $data['status'],
                scenario: (string) ($match['scenario'] ?? ''),
                competition: $match['competition'] ?? null,
                kickoffAt: $match['kickoff_at'] ?? null,
                minute: isset($data['minute']) ? (int) $data['minute'] : null,
                homeScore: isset($data['home_score']) ? (int) $data['home_score'] : null,
                awayScore: isset($data['away_score']) ? (int) $data['away_score'] : null,
                statistics: is_array($statistics) ? $statistics : [],
                vitalityScore: $statisticsRequested && is_numeric($data['vitality_score'] ?? null) ? (float) $data['vitality_score'] : null,
                methodScores: is_array($data['method_scores'] ?? null) ? $data['method_scores'] : [],
                statisticsCoverage: $this->statisticsCoverage($coverageStatistics),
                inPlay: ! in_array($data['status'], ['upcoming', 'finished'], true),
                statusShort: match ($data['status']) {
                    'halftime' => 'HT',
                    'upcoming' => 'NS',
                    'finished' => 'FT',
                    default => 'LIVE',
                },
            );
        }

        $requiredStatistics = ['shots', 'shots_on_target', 'possession', 'corners'];
        $statisticsAvailable = ! $includeStatistics
            ? null
            : collect($matches)->contains(
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
            simulationSettings: is_array($fixture['simulation_settings'] ?? null)
                ? $fixture['simulation_settings']
                : [],
        );
    }

    /**
     * @param  array<string, mixed>  $statistics
     */
    /**
     * Simulation : les matchs « à venir » du jeu de données fictif, quelle que soit la date.
     */
    public function getFixturesByDate(string $date): FootballFeed
    {
        $feed = $this->getLiveMatches(includeStatistics: false);

        return new FootballFeed(
            driver: $feed->driver,
            reachable: $feed->reachable,
            statisticsAvailable: null,
            statusMessage: 'Simulation : matchs à venir fictifs, aucune API.',
            matches: array_values(array_filter($feed->matches, fn (FootballMatch $match): bool => $match->statusShort === 'NS')),
            requestsUsed: 0,
        );
    }

    private function statisticsCoverage(array $statistics): ?bool
    {
        if ($statistics === []) {
            return null;
        }

        return count(array_intersect(
            ['shots', 'shots_on_target', 'possession', 'corners'],
            array_keys($statistics),
        )) === 4;
    }
}
