# Prompt Copilot : terminer toute la Phase 1 de PronoFoot (sans rien acheter)

Colle ce texte dans Copilot (mode agent), à la racine du projet `pronofoot`.

---

## Contexte
Tu travailles sur PronoFoot, Phase 1 : un détecteur live de football réservé à l'administrateur. Il surveille des matchs, applique les règles F121 et 3 filtres, envoie une alerte WhatsApp (Telegram en repli), tient un journal et des statistiques. **Il ne place jamais de pari.**

Avant tout, lis : `Claude.md`, `backend/CLAUDE.md`, `docs/AVANCEMENT_PHASE1.md`, `docs/PRONOFOOT_CDC_Phase1_Signaux_Live.pdf`, `docs/PRONOFOOT_CDC_V9.1.pdf`, le PRD et le TRD dans `docs/`.

Stack : Laravel 13 (PHP 8.5) dans `backend/`, React + Vite dans `frontend/` (compilé vers `backend/public/admin-assets/`), MySQL WAMP, Windows, pas de Docker en développement. Utilise la documentation de Laravel 13.

Les étapes 1 à 4 sont faites (base de données, moteur de règles, connexion admin + 2FA, pages React). **Ta mission : réaliser les étapes 5 à 8 et tout ce qui reste de la Phase 1, en ne dépendant d'aucun achat.** Nous n'avons pas encore de clés API, de compte WhatsApp ni de serveur. Tout doit donc fonctionner de bout en bout avec des pilotes fictifs (« fake »), et être prêt à passer en réel en changeant seulement le `.env`.

## Règles absolues
1. **N'invente aucun seuil, aucune formule, aucune règle métier.** Si une valeur n'est pas dans les documents, mets-la en paramètre sans valeur par défaut, affiche « à confirmer », et le comportement sûr est : pas d'alerte.
2. Règles sans formule connue (F121-K, F121-T, F121-X, F122, F124, F126) : verdict « non défini », jamais d'alerte. F121-E : ne pas coder (deux définitions contradictoires).
3. Le moteur de règles reste du PHP pur (sans réseau ni base de données).
4. Une classe par fichier, nom du fichier = nom de la classe (PSR-4).
5. Aucune clé ni jeton dans le code ou Git ; tout dans `.env`, avec `.env.example` à jour.
6. Aucun pari automatique, nulle part.
7. Ne casse pas l'existant : `php artisan test`, `vendor\bin\pint --test`, `npm test`, `npm run lint`, `npm run build` doivent passer après chaque étape.
8. Ne fabrique jamais de fausses données dans l'interface en mode normal. En mode simulation, affiche un bandeau bien visible « MODE SIMULATION : données fictives » pour que personne ne confonde une alerte fictive avec une vraie.
9. Un commit Git par étape, avec un message clair en français. Ne pousse pas les fichiers `.env` ni `public/admin-assets/hot`.

## À faire, dans cet ordre

### Étape 5 : Clients API et commande de faisabilité
- Crée deux interfaces : `OddsProvider` (cotes, dont les scores exacts, Over/Under) et `FootballProvider` (matchs en direct, score, minute, statistiques : tirs, tirs cadrés, possession, corners, buts).
- Pour chacune, deux pilotes choisis dans `.env` (`ODDS_DRIVER=fake|real`, `FOOTBALL_DRIVER=fake|real`) :
  - **fake** : scénarios déterministes et rejouables (fichiers JSON dans `database/fixtures/`), incluant au moins : un match qui déclenche une alerte, un match refusé par chaque filtre, un match avec un but marqué en cours de scan, un match avec donnée manquante, une panne d'API.
  - **real** : squelette complet (appel HTTP avec timeout, nouvelles tentatives, gestion des erreurs, suivi du quota restant), prêt à brancher. Pour The Odds API et API-Football, consulte la documentation officielle pour les URL et champs ; ne devine pas la forme des réponses. Isole toute la conversion de format dans une seule classe « Mapper » par fournisseur, pour la corriger facilement quand on aura de vraies réponses.
- Commande `php artisan feasibility:test` : appelle les pilotes configurés et affiche un rapport lisible : fournisseur joignable, matchs en direct trouvés, **cotes de scores exacts disponibles en direct : oui/non**, statistiques disponibles, quota consommé par appel, estimation de la consommation par heure pour N matchs suivis. Avec les pilotes fake, le rapport doit être clairement marqué « simulation ».
- Tests unitaires de chaque pilote fake et du Mapper avec des réponses d'exemple.

### Étape 6 : Scan, relance après un but, expiration
- Table des paramètres (voir étape 8) : fréquences configurables. Valeurs du CDC : cotes toutes les 30 s, statistiques toutes les 1 min, relance toutes les 15 s pendant 2 min après un but. Relis le CDC pour confirmer ; ne retiens que ce qui y est écrit.
- Commande `php artisan scan:run` : boucle qui, pour chaque match suivi, récupère cotes et statistiques, enregistre un instantané (`match_snapshots`), calcule les entrées du moteur, appelle `RuleEngine`, puis crée une alerte si et seulement si le moteur le décide. En développement, une commande `scan:once` fait un seul passage pour les tests.
- Calcul des entrées à partir des instantanés, **entièrement paramétré** :
  - Vitalité : pondérations du CDC (tirs 30, tirs cadrés 30, possession 20, corners 20). La normalisation n'est pas définie : crée un paramètre « valeurs de référence de normalisation » sans valeur par défaut. S'il est vide, la vitalité est « non calculable » et il n'y a pas d'alerte. Les scénarios fake peuvent fournir la vitalité directement pour tester.
  - Tendance : variation des cotes sur 2 minutes à partir des instantanés. Le seuil de « stable » est un paramètre sans valeur par défaut.
  - Convergence : seulement avec les notes et poids que les documents définissent ; sinon « non calculée ».
- Détection de but : si le score change, passe en rythme rapide 2 minutes, réévalue, et invalide les alertes devenues fausses. Écris la règle exacte dans `docs/` après l'avoir relue dans le CDC.
- Anti-doublon : une seule alerte active par match, règle et sélection.
- Expiration : une alerte active expire après 15 minutes (paramètre) ; statut « expirée » conservé dans l'historique.
- Résilience : si une API tombe, on journalise l'incident, on réessaie, et on ne crée jamais d'alerte à partir de données périmées. Respecte le quota : n'appelle pas plus que nécessaire, et arrête proprement si le quota est presque épuisé (paramètre d'alerte).
- Fournis la configuration pour lancer le scan en continu (Windows en dev : `php artisan scan:run` dans un terminal ; en production : Supervisor, documenté à l'étape 8).
- Tests : scénario complet avec le pilote fake (alerte créée, doublon évité, but marqué, expiration à 15 min, panne d'API, donnée manquante), avec une horloge simulée.

### Étape 7 : Notifications WhatsApp (Telegram en repli)
- Interface `NotificationChannel` avec pilotes : `log` (écrit dans un fichier, pour le développement), `whatsapp`, `telegram`. Choix et ordre de repli dans `.env` (`NOTIFICATION_CHANNEL`, `NOTIFICATION_FALLBACK`).
- WhatsApp : squelette conforme à l'API WhatsApp Business Cloud (message modèle, destinataire admin, jeton dans `.env`). Ne devine pas les détails : lis la documentation officielle de Meta. Telegram : bot simple (`sendMessage`).
- Message d'alerte en français, court, lisible sur téléphone : match, minute, score, équipe ciblée, règle, écart, vitalité, tendance, convergence, heure d'expiration. Pas de promesse de gain.
- Envoi par une file d'attente (job) avec nouvelles tentatives ; statut d'envoi (envoyé, échec, repli utilisé) enregistré dans `alerts`.
- Page ou bouton « Envoyer un message de test » dans Paramètres.
- Tests avec le pilote `log` et des pilotes simulés (échec, repli).

### Étape 8 : Journal, statistiques, paramètres, matchs, déploiement
1. **Matchs suivis** : branche le bouton « Gérer les matchs » : liste des matchs en direct et à venir (via le pilote), ajout/retrait par l'admin, limité par le quota. La liste suivie s'affiche en vue d'ensemble avec équipes, score, minute, vitalité, état.
2. **Paramètres modifiables** (demande du client : l'admin doit pouvoir corriger la méthode). Table `settings` (clé, valeur, type, description, « à confirmer » oui/non). Page Paramètres éditable avec validation côté serveur, bouton « Rétablir les valeurs par défaut du CDC », et **historique des modifications** (qui, quand, ancienne et nouvelle valeur). Les valeurs modifiées sont réellement utilisées par le scan et le moteur. Sans valeur dans un paramètre « à confirmer », comportement sûr = pas d'alerte.
3. **Moteur de règles (page)** : l'admin peut activer/désactiver une règle disponible et modifier ses seuils ; les règles « non définies » restent verrouillées avec l'explication.
4. **Journal** : chaque évaluation et chaque alerte enregistrées avec la décision et sa justification (règle, valeurs, filtres passés/refusés). Page avec filtres (date, match, règle, statut) et pagination. L'admin peut saisir le résultat d'une alerte (gagné, perdu, annulé) ; ne l'automatise que si la source donne le score final.
5. **Statistiques** : nombre d'alertes, taux de réussite par règle et par période, alertes refusées par filtre. Seulement des chiffres calculés à partir du journal, jamais d'exemple fictif.
6. **Page Vue d'ensemble** : statut du scan (actif/inactif, dernier passage), quota API restant, alertes actives avec compte à rebours d'expiration, matchs suivis.
7. **Nettoyage de l'interface** : supprime les phrases de développeur visibles (« Le CDC prévoit… », « sera relié aux prochaines étapes ») ; remplace-les par des états vides courts. Texte de base 16 px, secondaire 14 px minimum, rien en dessous de 13 px (vérifie `App.css`). Zones tactiles de 44 px minimum. Pense téléphone d'abord.
8. **Sécurité** : la 2FA reste obligatoire hors `APP_ENV=local` ; en-têtes de sécurité, cookies sécurisés en production, limitation des tentatives, aucune donnée sensible dans les journaux. Ajoute `backend/public/admin-assets/hot` au `.gitignore` et retire-le de Git.
9. **Préparation du déploiement (sans déployer)** : crée `docs/DEPLOIEMENT.md` avec : prérequis serveur (PHP 8.5, MySQL, Nginx, Node pour le build), variables `.env.production.example`, configuration Nginx, configuration Supervisor (scan + file d'attente), HTTPS (Let's Encrypt), utilisateur MySQL dédié, sauvegarde quotidienne de la base (script), rotation des journaux, liste de contrôle avant livraison (supprimer le compte de test, créer l'admin avec `php artisan admin:create`, mettre les vraies clés), et procédure pour passer des pilotes fake aux pilotes real.

## Ce que tu ne dois PAS faire
- Ne pas acheter, ni t'inscrire, ni appeler une vraie API payante.
- Ne pas implémenter F121-E, K, T, X, F122, F124, F126, ni les fonctions des Phases 2 et 3 (utilisateurs, abonnements, paiements, coupons, pronostics publics).
- Ne pas inventer de valeurs « raisonnables » à la place des valeurs manquantes.

## Fin de mission
1. Mets à jour `docs/AVANCEMENT_PHASE1.md` : ce qui est fait, comment le tester, ce qui reste.
2. Rédige `docs/A_FOURNIR_PAR_LE_CLIENT.md` : liste claire de ce qui manque encore (clés API, compte WhatsApp, serveur et domaine, 10 situations de test, formule de vitalité, valeur de « tendance stable », choix pour F121-E, formules des règles non définies).
3. Écris `docs/PASSER_EN_REEL.md` : les étapes exactes, une fois les clés achetées (modifier `.env`, lancer `feasibility:test`, vérifier les cotes de score exact, ajuster les Mapper, test WhatsApp).
4. Lance tous les contrôles et donne-moi un rapport : tests passés, commandes pour voir chaque fonction marcher en mode simulation, limites connues.

Avance étape par étape. Après chaque étape : explique en peu de mots ce qui a été fait et comment le vérifier, puis passe à la suivante sans attendre, sauf si un document manque : dans ce cas, pose la question au lieu de deviner.