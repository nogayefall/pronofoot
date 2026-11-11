# Passage des fournisseurs en réel

Le fonctionnement fictif est disponible sans clé. Garder les deux pilotes sur `fake` tant que les blocages ci-dessous ne sont pas levés. Aucun fournisseur réel n’est appelé en mode fictif.

Pour les prérequis système, Nginx, Supervisor, HTTPS, sauvegardes et liste de contrôle, consulter [`DEPLOIEMENT.md`](./DEPLOIEMENT.md). Ce document est une préparation seulement : aucun serveur n’est provisionné ni déployé.

## 1. Vérifier les sources avant toute activation

1. Les cadences appliquées proviennent des documents disponibles : cotes toutes les 30 secondes, statistiques toutes les 60 secondes et expiration après 15 minutes sans but selon le PDF du CDC Phase 1 ; relance toutes les 15 secondes pendant 120 secondes après but selon le TRD. Vérifier ces valeurs paramétrables avant activation en production.
2. Avec The Odds API (`ODDS_DRIVER=real`), vérifier la disponibilité effective du marché de scores exacts en direct pour le compte, le sport et les régions visés. Le [catalogue officiel des marchés](https://the-odds-api.com/sports-odds-data/betting-markets.html) consulté ne documente pas ce marché. Ce pilote refuse le marché et **n’effectue aucun appel**.
3. API-Football (`FOOTBALL_DRIVER=real`, `ODDS_DRIVER=api_football`) utilise `https://v3.football.api-sports.io`, l’en-tête documenté `x-apisports-key`, `fixtures?live=all`, `fixtures/statistics?fixture=…`, `leagues?current=true` et `odds/live?bet=23`. La couverture se lit dans `response[].seasons[]`, selon la saison du match ; si elle manque, la saison marquée `current: true` est utilisée avec un avertissement. Une valeur `false` interdit le suivi ; une couverture absente/inconnue permet le suivi avec l’avertissement « Statistiques non confirmées ». Une valeur `true` ne garantit pas la disponibilité des statistiques pour chaque match. La capture du match `1635776` a `results: 0` et `response: []`, donc ses tirs, tirs cadrés, possession et corners restent non disponibles (null).
4. Les captures sont copiées sans déplacement sous `backend/database/fixtures/api-football/fixtures-live.json`, `fixtures-statistics.json` et `odds-live-bet-23.json`. Les tests les utilisent telles quelles. Les 27 matchs live et les 13 réponses contenant le marché 23 sont observés dans ces captures ; seuls les matchs éligibles (démarrés et non arrêtés) sont transmis avec des cotes utilisables. Le test des marchés confirme `id: 23` = `Final Score`. La capture statistiques est vide (`results: 0`) : les valeurs tirs, tirs cadrés, possession et corners restent non disponibles/nulles, jamais mises à zéro par défaut. Obtenir une réponse statistiques non vide avant d’activer ou valider les règles qui en dépendent.

## 2. Capturer une réponse API-Football sans l’exposer dans Git

Après vérification officielle, ajouter les valeurs propres à l’environnement, sans les committer, dans `backend/.env` :

```dotenv
FOOTBALL_DRIVER=real
API_FOOTBALL_API_KEY=<clé fournie par le client>
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
ODDS_DRIVER=api_football
```

Pour les captures dédiées des réponses live avant de compléter les Mappers, API-Football documente l’URL `https://v3.football.api-sports.io` et l’en-tête `x-apisports-key`. Configurer `API_FOOTBALL_API_KEY`, puis lancer depuis `backend` :

```powershell
php artisan api-football:capture
```

Cette commande exige `FOOTBALL_DRIVER=real`, annonce le nombre maximal d’appels (3 en mode standard, 4 en mode automatique) et affiche le quota connu avant chaque appel, sans afficher la clé ni les en-têtes d’authentification. Elle enregistre les corps de réponse tels quels dans `storage/feasibility/api-football/`.

- `php artisan api-football:capture` utilise le premier ID de match live exploitable.
- `php artisan api-football:capture --fixture=1635776` choisit un ID précis, qui doit figurer dans la réponse live du moment.
- `php artisan api-football:capture --auto-covered` appelle une fois `leagues?current=true`, affiche les ID live dont la couverture `coverage.fixtures.statistics_fixtures` est vraie, sélectionne le premier et demande confirmation avant l’appel des statistiques. Si aucun candidat n’est trouvé, cet appel est omis.

La capture réelle `leagues-current-20261111-113418-898130.json` contient la couverture sous `response[].seasons[].coverage.fixtures.statistics_fixtures`, avec l’année dans `seasons[].year`. L’extrait [leagues-current-extract.json](../backend/database/fixtures/api-football/leagues-current-extract.json) conserve dix entrées réelles utilisées par les tests. Le mode automatique compare d’abord la saison du match et, à défaut, utilise la saison `current: true`; seuls les matchs avec valeur finale `true` sont proposés. En mode `fake`, la commande refuse tout appel réseau. Les captures disponibles ne fournissent pas de statistiques non vides pour `1635776`.

Le pilote n’émet aucun appel si la clé manque et exige HTTPS. La vérification de faisabilité API-Football effectue trois requêtes au maximum : une liste live, les statistiques d’un seul match et les cotes bet 23. Elle lit le quota restant et la limite dans les en-têtes `x-ratelimit-requests-remaining` et `x-ratelimit-requests-limit`. Pour lancer une vérification (sans `--capture`, donc sans enregistrer une nouvelle copie locale) :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan feasibility:test --matches=30 --odds-interval=30 --stats-interval=60
```

Avec l’option `--capture`, les corps bruts sont conservés dans `backend/storage/feasibility/`; les clés présentes dans des champs reconnaissables ou recopiées dans le corps sont masquées. Ne pas partager les captures avant de les avoir examinées. La dernière capture statistiques fournie est vide ; le scan ne doit pas être considéré comme validé pour les données/statistiques tant qu’une réponse non vide et son mapping n’ont pas été vérifiés.

## 3. Valider le marché Odds

Le pilote The Odds API (`ODDS_DRIVER=real`) signale explicitement « marché des scores exacts non disponible » selon le [catalogue officiel des marchés](https://the-odds-api.com/sports-odds-data/betting-markets.html) consulté ; il ne substitue pas un autre marché et ne consomme aucun quota. Le pilote distinct API-Football est sélectionné avec `ODDS_DRIVER=api_football` et utilise uniquement `odds/live?bet=23`.

## 4. Vérifications avant le scan réel

- Garder `ODDS_DRIVER=fake` et `FOOTBALL_DRIVER=fake` jusqu’à validation distincte de chaque pilote. API-Football peut être sélectionné par `ODDS_DRIVER=api_football` après configuration de sa clé. L’interface et l’API refusent le suivi si le marché 23 non suspendu manque ou si la couverture est explicitement `false`; une couverture absente/inconnue est autorisée avec avertissement.
- Garder `NOTIFICATION_MODE=fake`. Les canaux WhatsApp et Telegram réels sont des refus explicites `NON VÉRIFIÉ` et ne font aucun appel tant que les comptes et formats n’ont pas été confirmés et implémentés. Le canal `log` est disponible pour valider la file en local.
- Exécuter `php artisan test` et `vendor\bin\pint --test`.
- Configurer seulement les paramètres confirmés par le CDC et lancer `php artisan feasibility:test` ; ajouter `--capture` uniquement lorsque la réponse doit être enregistrée.
- Confirmer les marchés et données live, les quotas et leur coût, la correspondance des matchs, ainsi que l’absence de données périmées.
- Confirmer les deux paramètres de tendance avant de les renseigner dans `tendance_source` et `tendance_seuil_stable`. L’hypothèse actuelle compare la cote du score exact suggéré au dernier instantané datant d’au moins deux minutes ; `3 %` n’est qu’un exemple non confirmé. Si un paramètre ou l’instantané de référence manque, la tendance est non calculable et aucune alerte n’est créée.
- Demander au client : « un écart négatif (cote du score suivant inférieure à la cote actuelle), qu'est-ce que ça signifie et que doit faire le système ? ». Garder `ecart_negatif_comportement` vide jusqu’à sa réponse. Le comportement actuel est l’abstention, journalisée avec `écart négatif : F121-E à confirmer`; ne pas activer un autre comportement avant d’avoir défini et testé la décision métier.
- Tester le cycle complet et les critères de sécurité sur des réponses de test avant toute activation de notifications réelles.
- Les pilotes et l’interface ne placent aucun pari. N’ajouter aucune intégration d’exécution de paris.
