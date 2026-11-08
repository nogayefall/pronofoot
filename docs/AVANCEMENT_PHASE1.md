# PronoFoot — Avancement de la Phase 1

Dernière mise à jour : 27 octobre 2026

## Références et périmètre

Le CDC V9.1 décrit le produit complet. Le développement en cours est limité à la Phase 1 : un outil réservé à l’administrateur qui surveille des matchs, évalue les règles et filtres définis, consigne les décisions et peut envoyer un signal. Le système ne place aucun pari.

Documents de référence présents dans `docs/` :

- `PRONOFOOT_CDC_V9.1.pdf` : périmètre global du produit.
- `PRONOFOOT_CDC_Phase1_Signaux_Live.pdf` : périmètre actuel et règles Phase 1.
- `PronoFoot Phase 1 – PRD.docx` : objectifs, critères d’acceptation et questions ouvertes.
- `PronoFoot Phase 1 – TRD.docx` : architecture et ordre de développement.
- `PRONOFOOT_Maquette_Demo_V9.1.pdf` : maquette du produit complet ; les écrans hors Phase 1 sont reportés.

L’ordre appliqué est celui de `Claude.md` :

1. Migrations et modèles.
2. Moteur de règles et tests.
3. Connexion administrateur et authentification à deux facteurs.
4. Pages d’administration React.
5. Clients API Odds et Football, puis commande de faisabilité.
6. Scan, nouvelle analyse après un but et expiration des alertes.
7. Alertes WhatsApp avec Telegram en repli.
8. Journal, statistiques et déploiement.

## Réalisé

### Étape 1 — Base de données et modèles

- Backend Laravel 13, frontend React avec Vite, base MySQL locale via WampServer.
- Configuration locale de `backend/.env` pour MySQL sur `127.0.0.1:3306`, base `pronofoot`, utilisateur `root` et mot de passe vide.
- Base `pronofoot` créée sur l’instance MySQL locale WampServer.
- InnoDB configuré pour les tables MySQL Laravel, car l’instance WampServer utilisait MyISAM par défaut et ne permettait pas les contraintes/index attendus.
- Tables Laravel initiales : utilisateurs, sessions, cache et tâches.
- Tables métier Phase 1 : matchs suivis, instantanés, profils de règles, journal des opportunités et alertes.
- Relations Eloquent et tests de persistance ajoutés.

### Étape 2 — Moteur de règles et tests disponibles

**État : code et tests techniques réalisés ; validation métier encore partielle.**

- Moteur PHP pur dans `backend/app/Rules/`, sans appel réseau ni accès à la base.
- F121-C : calcul des écarts domicile et extérieur depuis les cotes du score actuel et des deux scores suivants ; la plus petite différence indique la direction. L’égalité ou une cote manquante ne donne pas de signal exploitable.
- F121-C.2 : lorsque l’écart de score atteint au moins deux buts, la règle sélectionne l’équipe en tête.
- F121-D : seuil strict des cotes inférieur à 7,00, appliqué aux exemples de score 2–3 et 3–2. Une proposition Over 5.5 dépend d’un paramètre fourni ; aucune règle temporelle n’est inventée.
- Filtre d’écart : seuil 1,50 ; exception 0–0 lorsque la cote du score 0–0 est inférieure à 2,50, avec un écart requis inférieur à 1,00.
- Filtre de vitalité : seuil 40/100 fourni par le document ; la valeur doit être fournie en entrée. La normalisation des statistiques brutes n’est pas définie et n’est pas calculée par le moteur.
- Filtre de tendance : une baisse des cotes est reconnue ; le seuil d’une tendance stable est un paramètre non renseigné par défaut. Sans valeur confirmée, une tendance stable seule ne passe pas le filtre.
- Convergence : moyenne pondérée des notes fournies, exemple de calcul 82 × 0,6 + 68 × 0,3 + 90 × 0,1 = 78,6 ; l’alerte exige un score strictement supérieur au seuil configuré, par défaut 75.
- F121-E et les règles sans formule connue F121-K, F121-T, F121-X, F122, F124 et F126 restent « non définies » et ne produisent aucune alerte.
- Tests de règles, filtres et convergence dans `backend/tests/Unit/RuleEngineTest.php`.

**Validation métier incomplète :** le CDC Phase 1 demande au moins dix situations écrites par l’administrateur, avec données d’entrée et décision attendue. Une seule situation complète est fournie dans les documents : l’exemple 0–0 (cotes 7,50 / 8,60 / 9,80, vitalité 61 et tendance stable). Les tests techniques ajoutés ne remplacent pas ces dix cas.

### Étape 3 — Accès administrateur et 2FA

- Connexion Laravel par mot de passe **et** code TOTP à six chiffres.
- Secret TOTP chiffré dans la base avec la clé d’application Laravel.
- Commande `php artisan admin:create` pour créer le compte destiné à la livraison ; elle demande les informations de compte, affiche un secret TOTP à configurer dans l’application d’authentification, puis vérifie un premier code avant d’enregistrer le compte.
- Commandes de développement local `php artisan admin:create-test` et `php artisan admin:test-password-reset`. Elles créent un compte réservé à `APP_ENV=local` et permettent de remplacer le mot de passe en le saisissant de façon masquée. Ce compte de test local se connecte uniquement avec son adresse et son mot de passe ; les autres comptes administrateur gardent le TOTP.
- Le compte de test local est refusé hors de l’environnement `local` et doit être supprimé avant toute livraison.
- Aucun formulaire d’inscription publique ; le seeder ne crée plus de compte de démonstration.
- Protection de `/admin`, fermeture de session avec invalidation et régénération du jeton.
- Limitation des tentatives de connexion.
- Page de connexion française en Blade. L’interface d’administration React relève de l’étape 4.
- Tests TOTP fondés sur les vecteurs RFC 6238, tests de connexion, de refus, de limitation, de fermeture de session, de protection administrateur et de chiffrement du secret.
- La double authentification reste obligatoire pour le compte client hors environnement local ; le raccourci sans TOTP est limité au compte de test local.
- Validation initiale : `php artisan test` — 27 tests réussis, 100 assertions ; `vendor\bin\pint --test` — réussi ; migrations MySQL — appliquées.
- Le compte administrateur destiné au client doit être créé séparément au déploiement avec `php artisan admin:create` et une application TOTP. Il ne faut pas réutiliser le compte local.

### Étape 4 — Interface d’administration React

- Remplacement de la page provisoire par un tableau de bord React en français, adapté aux téléphones.
- Navigation admin : vue d’ensemble, matchs suivis, moteur de règles, testeur manuel, journal et paramètres.
- Vue d’ensemble revue pour la lisibilité mobile : statut du scan mis en évidence, compteur d’alertes actives et tableau des matchs avec équipes, score, minute, vitalité et état. Les données non disponibles ne sont pas simulées ; une seule action principale ouvre la gestion des matchs.
- Passe de lisibilité sur les autres pages : titres principaux à 28 px minimum, titres de panneaux à 18 px minimum, texte courant et champs à 16 px, texte secondaire à 14 px minimum, commandes principales à 44 px minimum et contraste renforcé.
- Typographie de la vue d’ensemble agrandie (texte principal 16 px, texte secondaire 14 px minimum, titre 30 px minimum) et principales zones tactiles portées à au moins 44 px.
- Les listes et indicateurs affichent un état vide honnête plutôt que des matchs, alertes ou statistiques fictifs. L’interface indique quand une fonction attend les prochaines étapes.
- Écran des règles qui distingue les règles utilisables, partielles et non définies ; aucune règle métier inconnue n’est présentée comme disponible.
- Testeur F125 relié au moteur PHP par `POST /admin/rule-test`, derrière la session administrateur et la protection CSRF. Les cotes, scores, vitalité et variation de tendance sont validés avant l’évaluation.
- La simulation indique explicitement qu’elle ne transmet pas de signal. Sans notes et poids de convergence fournis, elle ne calcule pas de convergence et ne peut pas déclencher d’alerte.
- Le bouton de déconnexion utilise la session protégée Laravel.
- Vite produit les ressources dans `backend/public/admin-assets/`, servies dans la page admin Laravel ; le tableau de bord n’est pas servi comme page publique dans les ressources de production. En mode développement, la racine Vite est refusée et les composants ne sont chargés que par la page Laravel après connexion.
- Les URL des ressources compilées sont relatives au sous-chemin WampServer du projet (`/pronofoot/backend/public/`), afin que les fichiers React restent accessibles même lorsque `APP_URL` ne correspond pas au chemin Wamp. La page conserve aussi un message de chargement utile si React ne démarre pas.
- Tests ciblés du formulaire React avec le moteur de test Node intégré, sans nouvelle dépendance.
- Vérification visuelle de la vue d’ensemble et navigation vers le testeur sur petit écran.

**Vérification (27 octobre 2026) :** `backend/php artisan test` — 39 tests réussis, 164 assertions ; Pint — réussi ; `frontend/npm test` — 3 tests réussis ; `frontend/npm run lint` — réussi ; `frontend/npm run build` — réussi.

## Guide de démarrage et de test local

### 1. Démarrer les deux serveurs et ouvrir la connexion

Dans un premier terminal PowerShell :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan serve --host=127.0.0.1 --port=8001
```

Dans un deuxième terminal PowerShell :

```powershell
Set-Location C:\wamp64\www\pronofoot\frontend
npm run dev
```

Vite ouvre le navigateur automatiquement sur `http://127.0.0.1:5174/` et redirige vers la connexion Laravel `http://127.0.0.1:8001/login`. Le port `8000` est déjà utilisé par un autre projet sur cette machine, donc PronoFoot utilise `8001`. Le port Vite `5173` pouvant aussi être occupé par cet autre projet, PronoFoot utilise `5174` par défaut. Si le navigateur ne s’ouvre pas, saisis directement l’adresse `http://127.0.0.1:8001/login`. Garde les deux terminaux ouverts pendant le développement.

La session web utilise le cookie `pronofoot-session`, afin d’éviter les collisions avec les cookies d’autres projets locaux servis sur `127.0.0.1`.

Le fichier `backend/public/admin-assets/hot` est automatiquement réglé sur le port Vite utilisé. Pour changer le port Laravel, modifie `APP_URL` dans `backend/.env` et définis l’adresse correspondante dans `VITE_BACKEND_URL` avant `npm run dev`. Pour choisir un autre port Vite, définis `VITE_PORT` avant de lancer Vite.

Pour reconstruire les ressources de production servies par Laravel :

```powershell
Set-Location C:\wamp64\www\pronofoot\frontend
npm run build
```

### 2. Créer ou réparer le compte de test

Dans PowerShell, depuis `backend/` :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan admin:create-test
```

La commande crée une seule fois le compte local et affiche l’adresse `admin-test@pronofoot.local` et un mot de passe temporaire généré. Conserve ce mot de passe de façon privée. En environnement `local`, ce compte de test se connecte avec ces deux informations seulement ; le code TOTP n’est pas demandé.

Si le mot de passe initial est perdu, remplace-le sans l’afficher dans le terminal :

```powershell
php artisan admin:test-password-reset
```

Au formulaire de connexion ouvert par Vite, saisis l’adresse `admin-test@pronofoot.local` et le mot de passe temporaire ou le nouveau mot de passe. Les autres comptes administrateur conservent le code TOTP, et la double authentification reste obligatoire hors de l’environnement local. Ne partage jamais le mot de passe.

### 3. Vérifier les pages de l’interface

Après connexion, essaie les rubriques du menu :

- **Vue d’ensemble** : les compteurs à zéro et l’état en attente sont normaux avant l’intégration des API et du scan.
- **Matchs suivis** : liste vide attendue avant l’intégration des clients API.
- **Moteur de règles** : vérifie que les règles documentées, partielles et non définies sont distinguées.
- **Testeur manuel** : essaie le cas du CDC ci-dessous.
- **Journal** : vide jusqu’à l’étape de journalisation.
- **Paramètres** : seuils affichés à titre de référence ; ils ne sont pas encore enregistrés.
- **Déconnexion** : renvoie à la connexion ; `/admin` redemande une session authentifiée. La racine Vite te ramène directement à cette connexion.

### 4. Tester le moteur avec l’exemple du cahier des charges

Dans **Testeur manuel**, utilise :

- score : `0` – `0` ;
- cotes des scores exacts :
  ```text
  0-0 = 7,50
  1-0 = 8,60
  0-1 = 9,80
  ```
- vitalité : `61` ;
- variation des cotes sur deux minutes : `-1`.

Clique sur **Évaluer la situation**. Résultats attendus : F121-C sélectionne l’équipe à domicile ; son écart est `1,10`, inférieur à `1,50` ; les filtres d’écart, de tendance à la baisse et de vitalité passent. Aucune alerte réelle n’est envoyée. La convergence reste non calculée sans notes et poids de méthodes.

Pour vérifier le refus du filtre de vitalité, recommence avec `39` : vitalité doit être refusée et aucune alerte ne doit être déclenchée. Pour vérifier le cas 0–0 spécial, utilise une cote 0–0 inférieure à `2,50` et un écart exactement égal à `1,00` : il doit être refusé car le seuil est strictement inférieur.

### 5. Lancer les vérifications automatisées

Backend Laravel :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan migrate:status
php artisan test
vendor\bin\pint --test
```

Frontend React :

```powershell
Set-Location C:\wamp64\www\pronofoot\frontend
npm test
npm run lint
npm run build
```

Les tests automatisés ne remplacent pas les dix situations complètes avec décisions attendues que l’administrateur doit encore fournir pour valider l’acceptation métier.

## Ce qui reste à faire

### Règles et décisions client à obtenir

- Fournir les dix situations de test admin complètes et leurs décisions attendues.
- Trancher les deux définitions contradictoires de F121-E avant son implémentation.
- Fournir la formule de normalisation de la vitalité, avec exemples chiffrés.
- Confirmer la limite de variation correspondant à « tendance stable ».
- Définir les formules manquantes de F121-K, F121-T, F121-X, F122, F124 et F126 avant de les activer.
- Préciser les cas de F121-D autres que les exemples 2–3 et 3–2, et les conditions éventuelles qui autorisent Over 5.5.
- Clarifier les bornes exactes des seuils lorsque les documents ne disent que « inférieur » ou « supérieur ».

### Étapes de développement restantes

5. **À faire — prochaine étape :** ajouter les interfaces de clients Odds et Football, leurs pilotes fictif et réel configurables dans `.env`, puis la commande de faisabilité des marchés et statistiques en direct.
6. **À faire :** ajouter le scan paramétrable, les instantanés, le scan renforcé après but et l’expiration des alertes.
7. **À faire :** ajouter l’envoi WhatsApp, le pilote fictif et le repli Telegram.
8. **À faire :** compléter le journal, le calcul des statistiques de réussite, les tests de recette, puis préparer le déploiement.

### À brancher lors des prochaines étapes d’intégration

- Les listes de matchs, compteurs, journal et statistiques sont des états vides, en attente de leurs routes et données.
- Les valeurs des seuils sont présentées comme références documentaires ; leur sauvegarde et leur application aux prochains scans ne sont pas encore reliées à la base.
- Le testeur simule actuellement l’évaluation des règles/filtres depuis l’interface. Le branchement du client d’API et des données réelles ou fictives appartient aux étapes suivantes.
- En développement, démarrer `php artisan serve --host=127.0.0.1 --port=8001` depuis `backend/` et `npm run dev` depuis `frontend/` dans deux terminaux. Laravel sert l’application sur le port 8001 et Vite redirige sa racine vers la connexion Laravel. Vite utilise le port 5174 par défaut pour éviter le port 5173 déjà occupé sur cette machine. Quand Vite n’est pas lancé, Laravel utilise les ressources compilées par `npm run build`.

Pour chaque API externe, confirmer la disponibilité réelle des marchés de score exact et Plus/Moins en direct ainsi que des statistiques avant de dépendre de ces données.

## Vérifications locales

Depuis `backend/` :

```powershell
php artisan migrate:status
php artisan test
vendor\bin\pint --test
```

Pour créer le compte administrateur la première fois :

```powershell
php artisan admin:create
```

Cette commande est prévue pour le compte client : elle exige une application TOTP pour enrôler et vérifier son authentificateur.

Pour accéder à l’interface pendant le développement local sans installer d’application TOTP :

```powershell
php artisan admin:create-test
```

La commande crée un compte local réservé aux tests, puis affiche une adresse courriel, un mot de passe temporaire généré et le code TOTP courant. Ce code expire après 30 secondes. Pour en obtenir un autre :

```powershell
php artisan admin:test-code
```

Utilise ces identifiants sur la page `/login` du backend Laravel. Ces commandes ne sont disponibles que si `APP_ENV=local`. Supprime le compte de test avant toute livraison.

Si le mot de passe initial du compte de test est perdu :

```powershell
php artisan admin:test-password-reset
```

Saisis deux fois un nouveau mot de passe d’au moins 12 caractères. La valeur est masquée au terminal et n’est jamais réaffichée.

Ne partage jamais un secret TOTP d’enrôlement, un code à usage unique ou un mot de passe.

## Sécurité et limites de l’environnement

- L’utilisateur MySQL `root` sans mot de passe est réservé au WampServer local de développement. Ne pas reprendre ce réglage sur un serveur ou un environnement exposé.
- Garder `APP_KEY`, mots de passe, secrets TOTP et futures clés API privés. `.env` ne doit pas être versionné.
- Avant tout déploiement : compte MySQL dédié avec mot de passe fort, HTTPS, configuration de production sans débogage, sauvegardes et procédure de récupération 2FA à définir.
- Le projet ne passe aucun pari et ne doit pas automatiser cette action.
