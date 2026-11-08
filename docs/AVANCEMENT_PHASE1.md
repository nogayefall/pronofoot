# PronoFoot — Avancement de la Phase 1

Dernière mise à jour : 8 novembre 2026

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
- Filtre de tendance : le moteur exige une variation calculée, la source `cote_suggeree` et un seuil stable renseigné. Si la source ou le seuil manque, aucune tendance ne passe le filtre.
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

### Étape 5 — Pilotes de données et faisabilité

- Contrats et DTO distincts pour les fournisseurs de cotes et de matchs.
- Pilotes `fake` rejouables depuis `backend/database/fixtures/football.json`, couvrant une situation candidate, les refus d’écart et de vitalité, l’absence de donnée de tendance, un but entre deux instantanés, des statistiques manquantes et une panne d’API.
- Sélection des pilotes par `ODDS_DRIVER` et `FOOTBALL_DRIVER`. Le mode fictif est marqué « MODE SIMULATION : données fictives » et ne produit aucun appel réseau.
- Le pilote réel Odds n’invente pas de marché de score exact : le catalogue officiel consulté ne le documente pas ; `feasibility:test` l’affiche comme non disponible et ne tente aucune substitution.
- Le pilote réel API-Football reste `NON VÉRIFIÉ`. Son mapper isolé ne suppose aucun champ de réponse. Une requête de capture n’est possible qu’après configuration explicite d’une URL HTTPS, d’une clé et de son en-tête documenté.
- `php artisan feasibility:test` affiche la disponibilité, les matchs en direct, les marchés, les statistiques et les quotas connus. Le calcul indicatif des appels exige les fréquences confirmées fournies par options ; l’hypothèse d’un appel par match est signalée et ne prétend pas connaître le regroupement ou le coût réel.
- `php artisan feasibility:test --capture` enregistre les corps de réponses dans `backend/storage/feasibility/`, sans enregistrer les clés d’accès. Ce dossier est ignoré par Git.
- Les éléments à fournir et les limites des pilotes réels sont consignés dans `A_FOURNIR_PAR_LE_CLIENT.md` et `PASSER_EN_REEL.md`.

### Étape 6 — Scan, relance après un but et expiration

- Les PDF `PRONOFOOT_CDC_Phase1_Signaux_Live.pdf` et `PRONOFOOT_CDC_V9.1.pdf` ont été relus avant l’implémentation. Le CDC Phase 1 indique une lecture des cotes toutes les 30 secondes, des statistiques toutes les 60 secondes et l’expiration d’une alerte sans but après 15 minutes.
- Les paramètres correspondants sont enregistrés en base et appliqués par le scan. La relance à 15 secondes pendant 120 secondes après détection d’un but vient du TRD ; elle reste configurable et est distinguée des cadences explicitement indiquées dans le CDC.
- `php artisan scan:once` effectue un passage ; `php artisan scan:run` maintient le processus en boucle. Les statistiques ne sont demandées qu’à leur cadence ; les cotes sont rafraîchies à leur cadence ou immédiatement après un but.
- Chaque passage conserve un instantané des données disponibles et leur heure de capture. Des données absentes ou trop anciennes ne sont pas utilisées pour déclencher une alerte ; les erreurs de fournisseurs sont journalisées dans les opportunités.
- Un changement à la hausse du score est journalisé comme but, invalide les alertes actives du match et déclenche une réévaluation. Les corrections de score à la baisse ne sont pas interprétées comme un but.
- Les alertes ne sont créées que si le moteur les autorise, si un profil actif et sa convergence sont configurés et si toutes les données requises sont disponibles. Une alerte active n’est pas dupliquée pour le même match, règle et sélection.
- Les paramètres `tendance_source` et `tendance_seuil_stable` sont persistés sans valeur jusqu’à confirmation du client. L’hypothèse fake explicite les paramètres dans la fixture. La vitalité n’est pas calculée à partir de statistiques brutes ; une donnée manquante entraîne l’abstention.
- La tendance est calculée sur la cote du score exact suggéré, avec le dernier instantané de cotes datant d’au moins deux minutes ; formule : `(cote actuelle − cote à −2 min) / cote à −2 min × 100`. Une baisse est négative ; une variation absolue inférieure ou égale au seuil configuré est stable. Une référence absente ou trop récente, une source différente ou un paramètre vide provoque l’abstention.
- Les alertes restent en file d’attente à cette étape ; aucun envoi WhatsApp ou Telegram n’est encore branché. Aucun pari n’est placé.

**Vérification (8 novembre 2026) :** migrations appliquées à la base locale ; `php artisan test` — 67 tests réussis, 290 assertions ; `vendor\bin\pint --test` — réussi. Les tests de scan couvrent la création de signal fake, le calcul de tendance depuis l’instantané, l’abstention si la référence manque ou est trop récente, l’anti-doublon, le but et l’invalidation, l’expiration, l’indisponibilité des cotes exactes, la panne fournisseur et les statistiques absentes. Les vérifications frontend et `feasibility:test --capture` réalisées à l’étape 5 restent valides.

### Étape 7 — Notifications WhatsApp et repli Telegram

- Interface de notification et canaux `log`, `whatsapp` et `telegram`, sélectionnés avec `NOTIFICATION_CHANNEL` et `NOTIFICATION_FALLBACK`.
- En mode fake, WhatsApp et Telegram sont simulés sans réseau ; le canal `log` écrit le message dans le journal Laravel. Une panne simulée du canal principal utilise le repli configuré.
- Le mode `real` refuse explicitement les canaux WhatsApp et Telegram tant que leurs formats et comptes ne sont pas vérifiés ; aucun endpoint réel ni format non confirmé n’est utilisé.
- Les alertes passent par le job `SendAlertNotification`, après validation de la transaction, avec trois tentatives. Le statut, le canal utilisé, le recours au repli et les échecs sont conservés.
- Le point d’entrée admin protégé `POST /admin/notifications/test` est relié au bouton de test de la page Paramètres.
- Le message court inclut match, minute, score, équipe/sélection, règle, écart, vitalité, tendance, convergence et expiration ; il ne promet aucun gain.
- Pour tester le job lorsque la file n’est pas `sync`, lancer `php artisan queue:work --tries=3` dans un terminal en plus du scan.
- Tests ciblés des notifications et du scan : `php artisan test --filter="ScanServiceTest|AdministratorAuthenticationTest"` — 33 tests réussis, 162 assertions ; suite complète : 71 tests, 304 assertions ; `vendor\bin\pint --test` — réussi.

### Étape 8 — Administration, journal, statistiques et préparation au déploiement

- API admin protégée pour le tableau de bord, les quotas connus, les rencontres disponibles et suivies, les paramètres et leur historique, le profil de règles, le journal, les résultats manuels et les statistiques.
- L’interface React consomme ces API : ajout/retrait de matchs (refus si le fournisseur annonce un quota nul), configuration, test des notifications, filtres du journal et des statistiques, résultats d’alertes et compte à rebours.
- L’interface indique visiblement le mode simulation lorsqu’un pilote fictif fournit les données. Elle ne présente pas de données de fournisseurs inventées en mode normal ; les absences restent explicites.
- Les poids de convergence sont laissés vides jusqu’à validation, les règles non définies restent bloquées, et les paramètres de tendance restent à confirmer par défaut.
- Le tableau de bord affiche l’état du scan et les dernières données disponibles ; aucun indicateur de scan ou quota n’est fabriqué lorsqu’il est inconnu.
- Les styles de l’interface garantissent une taille minimale de 13 px, un texte secondaire d’au moins 14 px et des commandes tactiles d’au moins 44 px.
- En-têtes de sécurité ajoutés ; le cookie de session devient Secure en production par défaut. Les canaux/API réels restent non vérifiés et sans appels réels.
- `backend/public/admin-assets/hot` est ignoré par Git. Le guide [`DEPLOIEMENT.md`](./DEPLOIEMENT.md) décrit Nginx, Supervisor, HTTPS, sauvegardes, rotation et contrôles sans effectuer de déploiement.
- Test du quota nul et tests des API admin ajoutés.

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
- Confirmer que la tendance porte bien sur la cote suggérée et la limite de variation correspondant à « tendance stable ».
- Définir les formules manquantes de F121-K, F121-T, F121-X, F122, F124 et F126 avant de les activer.
- Préciser les cas de F121-D autres que les exemples 2–3 et 3–2, et les conditions éventuelles qui autorisent Over 5.5.
- Clarifier les bornes exactes des seuils lorsque les documents ne disent que « inférieur » ou « supérieur ».
- Fournir les clés API, comptes de notification autorisés, domaine et serveur lorsque le client sera prêt à financer et valider une mise en réel.

### État des étapes

5. **Terminé :** pilotes fake et real prudents, commande de faisabilité et capture sans clés.
6. **Terminé :** scan paramétrable, instantanés, relance après but, anti-doublon et expiration.
7. **Terminé en mode fake/log :** file d’attente, bouton de test et repli simulé. WhatsApp et Telegram réels restent bloqués tant que leurs comptes et formats ne sont pas validés.
8. **Terminé pour la préparation logicielle :** API et interface d’administration, journal, statistiques et guide de déploiement. La mise en production elle-même n’est pas incluse.

### Contrôles de l’étape 8

- Validation finale (2026-11-08) : `php artisan test` — 78 tests réussis, 353 assertions ; `vendor\bin\pint --test` — réussi ; `npm test` — 3 tests réussis ; `npm run lint` — réussi ; `npm run build` — réussi.
- `php artisan migrate:status` confirme que les migrations locales sont appliquées.
- `php artisan feasibility:test` — mode simulation explicite, 6 matchs live Odds et 7 Football fictifs, scores exacts/Over-Under et statistiques présents dans les fixtures ; fréquences non fournies donc estimation horaire non calculée.
- Vérification HTTP locale : `/` sur le port Vite 5174 redirige vers `/login` sur Laravel 8001 ; la page de connexion répond 200 et inclut `X-Frame-Options: DENY`.
- Vérification CSS : aucune déclaration `font-size` inférieure à 13 px. La vérification visuelle de l’espace admin authentifié reste à réaliser dans un navigateur équipé d’un moteur Playwright.
- En développement, démarrer `php artisan serve --host=127.0.0.1 --port=8001` depuis `backend/` et `npm run dev` depuis `frontend/` dans deux terminaux. Laravel sert l’application sur le port 8001 et Vite redirige sa racine vers la connexion Laravel. Vite utilise le port 5174 par défaut pour éviter le port 5173 déjà occupé sur cette machine. Quand Vite n’est pas lancé, Laravel utilise les ressources compilées par `npm run build`.

Les limites et informations client requises sont listées dans [`A_FOURNIR_PAR_LE_CLIENT.md`](./A_FOURNIR_PAR_LE_CLIENT.md). Le passage progressif aux fournisseurs réels est décrit dans [`PASSER_EN_REEL.md`](./PASSER_EN_REEL.md) ; aucun appel payant n’est effectué en suivant les contrôles fake.

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
### Tendance (hypothèse à confirmer)

Le calcul préparé compare la cote du score exact de l’équipe ciblée par la règle, entre la cote courante et le dernier instantané dont les données de cotes datent d’au moins deux minutes :

`(cote actuelle − cote à −2 min) / cote à −2 min × 100`

Une variation négative est une baisse ; une variation absolue inférieure ou égale à `tendance_seuil_stable` est stable. La source `cote_suggeree` et le seuil restent vides dans les paramètres persistés jusqu’à confirmation du client. Les scénarios fake les renseignent explicitement pour tester le calcul ; une référence manquante ou trop récente provoque l’abstention.
