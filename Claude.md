# PronoFoot Phase 1

Détecteur live réservé à l'administrateur. Il surveille des matchs, applique les règles F121 et envoie un signal WhatsApp. Il ne place jamais de pari.

Documents de référence (à lire avant tout) :
- docs/PRD.md : ce que fait le produit
- docs/TRD.md : choix techniques et plan de développement
- docs/CDC_V9.1.pdf : cahier des charges complet du client
- docs/CDC_Phase1.pdf : détail de la Phase 1 (formules, seuils, exemple)

## Structure
- backend/ : Laravel 13 (API, moteur de règles, scan, alertes)
- frontend/ : React avec Vite (pages admin)
- Base MySQL de WAMP en local. Pas de Docker pendant le développement.

## Environnement
- Windows, PHP 8.5, Composer 2.9, Node 26, npm 11
- Laravel 13 est récent : se baser sur la documentation officielle de Laravel 13, pas sur d'anciennes versions.

## Règles de travail
- Ne jamais inventer un seuil, une formule ou une règle métier. Si une règle n'est pas décrite dans les documents, le dire et poser la question.
- Règles sans formule connue (F121-K, F121-T, F121-X, F122, F124, F126) : verdict « non défini », jamais d'alerte.
- F121-E a deux définitions incompatibles : ne pas la coder tant que le client n'a pas tranché.
- Vitalité (normalisation) et « tendance stable » : valeurs à confirmer par le client. Les mettre en paramètres, sans les figer.
- Le moteur de règles est une classe PHP pure, sans réseau ni base de données, testable avec des données fictives.
- Une classe par fichier, avec le nom du fichier égal au nom de la classe (autoload PSR-4).
- Écrire les tests avec chaque règle, lancer `php artisan test`, et corriger jusqu'à ce que tout passe avant de dire qu'une étape est finie.
- APIs : une interface avec deux pilotes, fake et real, choisis dans .env. Tout doit marcher de bout en bout avec les pilotes fictifs, sans clé.
- Les clés API et jetons restent dans .env, jamais dans le code ni dans Git.
- Aucun pari automatique.
- Avancer étape par étape selon le plan du TRD. Ne pas sauter d'étape. Après chaque étape, expliquer en peu de mots ce qui a été fait et comment le vérifier.

## Ordre de développement
1. Migrations et modèles
2. Moteur de règles et tests (avec les situations fournies par l'admin)
3. Accès admin : connexion et 2FA
4. Pages admin React
5. Clients API (Odds, Football), commande de faisabilité
6. Scan, relance après un but, expiration des alertes
7. Alertes WhatsApp (Telegram en repli)
8. Journal, statistiques, déploiement