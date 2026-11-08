# Passage des fournisseurs en réel

Le fonctionnement fictif est disponible sans clé. Garder les deux pilotes sur `fake` tant que les blocages ci-dessous ne sont pas levés. Aucun fournisseur réel n’est appelé en mode fictif.

## 1. Vérifier les sources avant toute activation

1. Confirmer dans le CDC Phase 1 les cadences et les seuils utilisés par le scan.
2. Avec le fournisseur Odds, vérifier la disponibilité effective du marché de scores exacts en direct pour le compte, le sport et les régions visés. Le [catalogue officiel des marchés](https://the-odds-api.com/sports-odds-data/betting-markets.html) consulté ne documente pas ce marché. Le pilote réel actuel refuse le marché et **n’effectue aucun appel**. Ne pas basculer ce pilote tant que cette capacité n’est pas confirmée et implémentée à partir d’une réponse documentée.
3. Avec API-Football, confirmer dans la documentation du compte l’URL, le nom de l’en-tête d’authentification, les endpoints, les quotas et les réponses de score et de statistiques. Le pilote contient un point de capture générique ; son mapper reste `NON VÉRIFIÉ` et ne convertit aucun champ.
4. Préparer des réponses de test expurgées et faire valider les mappers isolés par des tests avant d’autoriser le scan. Tant que les correspondances entre identifiants de matchs et données des deux fournisseurs ne sont pas confirmées, ne pas créer d’alertes réelles.

## 2. Capturer une réponse API-Football sans l’exposer dans Git

Après vérification officielle, ajouter les valeurs propres à l’environnement, sans les committer, dans `backend/.env` :

```dotenv
FOOTBALL_DRIVER=real
API_FOOTBALL_PROBE_URL=<URL HTTPS documentée, sans clé dans l’URL>
API_FOOTBALL_API_KEY=<clé fournie par le client>
API_FOOTBALL_API_KEY_HEADER=<nom d’en-tête confirmé dans la documentation officielle>
```

Le pilote n’émet aucun appel si l’URL, la clé ou le nom d’en-tête manque. Il exige HTTPS et conserve des délais et tentatives bornés. Après avoir vérifié l’adresse et le coût de l’appel, lancer :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan feasibility:test --capture
```

Le corps brut est conservé dans `backend/storage/feasibility/`; les clés présentes dans des champs reconnaissables ou recopiées dans le corps sont masquées. Ne pas partager les captures avant de les avoir examinées. Un mapper non vérifié n’indique pas que les statistiques sont utilisables : la commande doit rester en échec tant qu’elles n’ont pas été validées.

## 3. Valider le marché Odds

Le pilote réel Odds signale explicitement « marché des scores exacts non disponible » selon le [catalogue officiel des marchés](https://the-odds-api.com/sports-odds-data/betting-markets.html) consulté ; il ne substitue pas un autre marché et ne consomme aucun quota. Une clé API ne suffit donc pas pour activer le scan. Si le fournisseur confirme ultérieurement un marché documenté, enregistrer une réponse expurgée, adapter le mapper isolé, écrire ses tests de contrat, puis relancer la faisabilité avant de sélectionner `ODDS_DRIVER=real`.

## 4. Vérifications avant le scan réel

- Garder `ODDS_DRIVER=fake` et `FOOTBALL_DRIVER=fake` jusqu’à validation distincte de chaque pilote.
- Exécuter `php artisan test` et `vendor\bin\pint --test`.
- Configurer seulement les paramètres confirmés par le CDC et lancer `php artisan feasibility:test` ; ajouter `--capture` uniquement lorsque la réponse doit être enregistrée.
- Confirmer les marchés et données live, les quotas et leur coût, la correspondance des matchs, ainsi que l’absence de données périmées.
- Tester le cycle complet et les critères de sécurité sur des réponses de test avant toute activation de notifications réelles.
- Les pilotes et l’interface ne placent aucun pari. N’ajouter aucune intégration d’exécution de paris.
