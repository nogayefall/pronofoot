# Préparer le déploiement PronoFoot

Ce guide décrit un déploiement Linux. Il a servi à la mise en production du 20 novembre 2026 (voir `AVANCEMENT_PHASE1.md`). Telegram réel est branché (voir [`PASSER_EN_REEL.md`](./PASSER_EN_REEL.md)) ; WhatsApp ne l’est pas.

## Prérequis

- Ubuntu LTS maintenu, Nginx, PHP 8.5 avec les extensions exigées par `composer.json` (et `pcntl` pour l’arrêt propre de `scan:run` sur signal), PHP-FPM et Composer 2.9. Sur Ubuntu 24.04, le PHP fourni (8.3) est trop ancien : installer PHP 8.5 depuis le dépôt `ppa:ondrej/php`.
- MySQL compatible avec Laravel 13, utilisateur applicatif dédié et base InnoDB.
- Node.js 26 et npm 11 pour compiler `frontend/` vers `backend/public/admin-assets/`.
- Supervisor pour maintenir `scan:run` et le worker de file en fonctionnement.
- DNS contrôlé par le client, HTTPS, stockage persistant pour les journaux et les sauvegardes.

Vérifier les versions et extensions avec les commandes du serveur avant installation :

```sh
php -v
php -m
composer --version
node --version
npm --version
mysql --version
```

## Fichiers prêts à copier (`deploy/`)

| Fichier | Destination sur le serveur | Rôle |
|---|---|---|
| `deploy/.env.production.example` | `/var/www/pronofoot/backend/.env` (à compléter) | Configuration de production commentée : `APP_DEBUG=false`, cookies sécurisés et chiffrés, journaux quotidiens, pilotes et notifications. |
| `deploy/nginx/pronofoot.conf` | `/etc/nginx/sites-available/pronofoot` | Redirection HTTP vers HTTPS, racine `backend/public`, fichiers cachés et `hot` interdits. |
| `deploy/supervisor/pronofoot.conf` | `/etc/supervisor/conf.d/pronofoot.conf` | `scan:run` (un seul processus, arrêt propre sur SIGTERM, limite mémoire) et `queue:work` (envoi des alertes). |
| `deploy/backup/backup-pronofoot.sh` | `/usr/local/sbin/backup-pronofoot.sh` | Sauvegarde quotidienne compressée et vérifiée de la base ; rétention à confirmer. |
| `deploy/backup/mysql-backup.cnf.example` | `/etc/pronofoot/mysql-backup.cnf` (`chmod 600`) | Identifiants du compte de sauvegarde, hors du script. |
| `deploy/logrotate/pronofoot` | `/etc/logrotate.d/pronofoot` | Rotation et compression des journaux Supervisor et Laravel. |
| `deploy/deploy.sh` | exécuté depuis `/var/www/pronofoot` | Maintenance, dépendances, **`npm run build`**, migrations, caches, arrêt propre du scan et de la file. |

Les scripts et fichiers de configuration sont forcés en fins de ligne LF (`deploy/.gitattributes`).

## Préparation de l’application

1. Récupérer le code par le mécanisme de livraison convenu avec le client dans `/var/www/pronofoot`.
2. Créer `backend/.env` depuis `deploy/.env.production.example`. Générer une nouvelle clé avec `php artisan key:generate --show` et la placer dans `APP_KEY` sans la publier. Renseigner l’URL HTTPS, la base, puis les vraies clés fournies par le client. Droits : `chmod 640`, propriétaire `root:www-data`.
3. Créer un utilisateur MySQL dédié avec les seuls droits nécessaires sur la base PronoFoot. Ne pas utiliser `root` ni un mot de passe vide.
4. Préparer `storage/` et `bootstrap/cache/` pour l’utilisateur PHP-FPM ; le code applicatif doit rester non modifiable par le processus web.
5. Lancer `sudo -u www-data bash deploy/deploy.sh`. **La compilation est obligatoire sur le serveur** : `backend/public/admin-assets/app.js` et `app.css` sont produits par `npm run build` et ne sont pas suivis par Git ; sans eux, l’interface d’administration ne se charge pas. Ne jamais copier le fichier `backend/public/admin-assets/hot` de développement.
6. Installer Nginx (`nginx -t`, puis rechargement), Certbot (`certbot --nginx -d pronofoot.example.com`), Supervisor (`supervisorctl reread && supervisorctl update`), la sauvegarde (tâche cron) et logrotate à partir des fichiers de `deploy/`.
7. Supprimer le compte de test avec `php artisan admin:delete-test`, puis créer le compte du client avec `php artisan admin:create` et terminer l’enrôlement TOTP.

## Scan continu

- Un seul `scan:run` à la fois (Supervisor, `numprocs=1`). Il relit les paramètres et le profil actif à chaque passage.
- Arrêt propre : `supervisorctl stop pronofoot-scan` (SIGTERM, fin du passage en cours) ou `php artisan scan:stop`.
- Au-delà de `--max-memory`, `scan:run` s’arrête proprement et Supervisor le relance. Une coupure de base provoque une reconnexion ; une erreur sur un match est consignée au Journal sans arrêter la boucle.
- Les alertes partent par la file : `queue:work` doit tourner (programme `pronofoot-queue`).

## Sauvegardes et journaux

- Sauvegarde quotidienne par `deploy/backup/backup-pronofoot.sh` ; tester une restauration hors production au moins une fois par mois. La durée de conservation (`RETENTION_DAYS`) est à confirmer avec le client ; vide, rien n’est supprimé.
- Journaux Laravel quotidiens conservés 14 jours ; journaux Supervisor tournés par logrotate. Les clés, jetons et mots de passe sont masqués automatiquement dans les journaux.
- Définir avec le client la rétention des instantanés et des captures avant d’activer une purge.

## Liste de contrôle avant livraison

Compte et sécurité :

- [ ] Compte de test supprimé : `php artisan admin:delete-test`.
- [ ] Compte administrateur du client créé avec `php artisan admin:create` ; application TOTP enrôlée et premier code vérifié.
- [ ] 2FA active : connexion testée avec mot de passe **et** code TOTP, `APP_ENV=production` (le raccourci sans TOTP n’existe qu’en `local`).
- [ ] Vraies clés uniquement dans `backend/.env` : nouvelle `APP_KEY`, `API_FOOTBALL_API_KEY`, mot de passe MySQL dédié ; aucun secret dans Git, les tickets ou les messages.
- [ ] `APP_DEBUG=false`, HTTPS actif, `SESSION_SECURE_COOKIE=true`, `SESSION_ENCRYPT=true`.

Application :

- [ ] `deploy/deploy.sh` exécuté sans erreur ; `app.js` et `app.css` présents dans `backend/public/admin-assets/`, pas de fichier `hot`.
- [ ] `supervisorctl status` : `pronofoot-scan` et `pronofoot-queue` en état RUNNING.
- [ ] Sauvegarde du jour présente et restauration testée hors production.
- [ ] logrotate testé (`logrotate --debug /etc/logrotate.d/pronofoot`).
- [ ] Pilotes réels activés un par un (voir [`PASSER_EN_REEL.md`](./PASSER_EN_REEL.md)) ; quota API-Football suffisant pour le nombre de matchs suivis.
- [ ] Telegram : `NOTIFICATION_MODE=real`, `NOTIFICATION_CHANNEL=telegram`, `NOTIFICATION_FALLBACK=log`, jeton et identifiant de conversation renseignés ; bouton « Envoyer un message de test » réussi et message reçu sur le téléphone.

Métier :

- [ ] Fichier Excel des dix situations fourni ; situations 2 à 8 validées, incohérences des situations 6 et 7 levées.
- [ ] Points « à confirmer » tranchés (voir [`A_FOURNIR_PAR_LE_CLIENT.md`](./A_FOURNIR_PAR_LE_CLIENT.md)) ; règles non définies désactivées.

## Passage progressif en réel

Ne pas mettre le scan en réel par simple changement simultané de variables. Suivre [`PASSER_EN_REEL.md`](./PASSER_EN_REEL.md), valider un pilote à la fois sur un environnement de test, puis documenter la décision avant activation. PronoFoot reste un détecteur : aucune fonction de pari automatique ne doit être ajoutée.
