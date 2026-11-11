# Préparer le déploiement PronoFoot

Ce guide prépare un déploiement Linux ; aucun serveur n’est configuré ni aucune livraison réalisée. Garder les fournisseurs sur `fake` et les notifications en mode `fake` tant que les validations métier, API et client ne sont pas terminées.

## Prérequis

- Ubuntu LTS maintenu, Nginx, PHP 8.5 avec les extensions exigées par `composer.json`, PHP-FPM et Composer 2.9.
- MySQL compatible avec Laravel 13, utilisateur applicatif dédié et base InnoDB.
- Node.js 26 et npm 11 pour compiler `frontend/` vers `backend/public/admin-assets/`.
- Supervisor pour maintenir `scan:run` et les workers de file en fonctionnement.
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

## Préparation de l’application

1. Récupérer le code par le mécanisme de livraison convenu et installer les dépendances sans celles de développement :

   ```sh
   cd /var/www/pronofoot/backend
   composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
   cd /var/www/pronofoot/frontend
   npm ci
   npm run build
   ```

2. Créer `backend/.env` depuis [`backend/.env.production.example`](../backend/.env.production.example). Générer une nouvelle clé avec `php artisan key:generate --show`, la placer dans `APP_KEY` sans la publier, puis renseigner l’URL HTTPS, la base et les secrets fournis par le client.
3. Créer un utilisateur MySQL dédié avec les seuls droits nécessaires sur la base PronoFoot. Ne pas utiliser `root` ni un mot de passe vide.
4. Préparer les répertoires `storage/` et `bootstrap/cache/` pour l’utilisateur PHP-FPM ; le code applicatif doit rester non modifiable par le processus web.
5. Migrer et mettre en cache la configuration :

   ```sh
   cd /var/www/pronofoot/backend
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

6. Créer le compte client avec `php artisan admin:create` et terminer l’enrôlement TOTP. Supprimer le compte de test local s’il a été importé ; ne jamais déployer un mot de passe de démonstration.

## Exemple de virtual host Nginx

Remplacer le domaine, la racine et le socket PHP-FPM selon le serveur. Le document root doit être `backend/public`, jamais la racine du dépôt.

Configurer le certificat après la validation DNS, par exemple avec Certbot pour Nginx :

```sh
sudo certbot --nginx -d pronofoot.example.com
sudo certbot renew --dry-run
```

Après Certbot, vérifier que les deux blocs Nginx correspondent au modèle HTTPS ci-dessous. Remplacer le domaine, la racine, le socket PHP-FPM et le chemin des certificats ; conserver le bloc ACME pour le renouvellement :

```nginx
server {
    listen 80;
    server_name pronofoot.example.com;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/pronofoot/backend/public;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name pronofoot.example.com;
    root /var/www/pronofoot/backend/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/pronofoot.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pronofoot.example.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_param HTTPS on;
        try_files $uri =404;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Valider avec `nginx -t`, puis recharger Nginx. L’application n’ajoute HSTS que pour une requête HTTPS en production ; ne pas activer HSTS avant que le domaine et TLS soient prêts.

## Processus Supervisor

Créer un programme distinct pour le scan et un worker pour la file. Adapter `user`, les chemins, l’environnement PHP et les paramètres de ressources :

```ini
[program:pronofoot-scan]
directory=/var/www/pronofoot/backend
command=/usr/bin/php artisan scan:run
user=www-data
autostart=true
autorestart=true
startsecs=5
stopasgroup=true
killasgroup=true
stdout_logfile=/var/www/pronofoot/backend/storage/logs/scan-supervisor.log
stderr_logfile=/var/www/pronofoot/backend/storage/logs/scan-supervisor-error.log

[program:pronofoot-queue]
directory=/var/www/pronofoot/backend
command=/usr/bin/php artisan queue:work --tries=3 --timeout=90
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stdout_logfile=/var/www/pronofoot/backend/storage/logs/queue-supervisor.log
stderr_logfile=/var/www/pronofoot/backend/storage/logs/queue-supervisor-error.log
```

Après installation de la configuration Supervisor, relire son état et vérifier que les deux processus restent actifs. Ne lancer qu’un seul processus `scan:run` pour éviter les passages concurrents. Configurer également une tâche cron Laravel si des commandes planifiées sont ajoutées.

## Sauvegardes et journaux

- Programmer une sauvegarde quotidienne de la base, chiffrée, avec test périodique de restauration. Créer `/etc/pronofoot/mysql-backup.cnf` avec les informations du compte de sauvegarde, puis restreindre ce fichier (`chmod 600`). Ne pas placer le mot de passe dans le script ou la ligne de commande.
- Exemple de script `/usr/local/sbin/backup-pronofoot.sh` (adapter la destination et le chiffrement avant utilisation) :

  ```sh
  #!/usr/bin/env bash
  set -euo pipefail
  umask 077

  backup_dir=/var/backups/pronofoot
  mkdir -p "$backup_dir"
  dump_file="$backup_dir/pronofoot-$(date +%F).sql"

  mysqldump --defaults-extra-file=/etc/pronofoot/mysql-backup.cnf \
    --single-transaction --routines --triggers pronofoot > "$dump_file"
  gzip "$dump_file"
  ```

- Appeler le script chaque jour depuis le planificateur choisi, restreindre l’accès aux sauvegardes et tester régulièrement une restauration hors production. Définir la rétention avec le client avant d’ajouter une purge automatique.
- Configurer `logrotate` pour les fichiers sous `backend/storage/logs/`, avec rotation, compression et permissions adaptées ; superviser l’espace disque. Ne jamais journaliser de clés, jetons, secrets TOTP ou mots de passe.
- Définir la rétention des instantanés et captures avec le client avant d’activer une purge. Les captures de faisabilité peuvent contenir des réponses fournisseur et doivent rester protégées.

## Liste de contrôle avant livraison

- [ ] Dix situations de test admin et décisions attendues validées.
- [ ] Normalisation de vitalité, tendance stable et source de tendance confirmées ; paramètres renseignés uniquement après confirmation.
- [ ] F121-E tranchée ; règles non définies restent désactivées.
- [ ] Marché de scores exact Odds confirmé et mapper API-Football validé sur des réponses expurgées ; `feasibility:test` concluant.
- [ ] Quotas, fréquence réelle, coût par requête et comportement en panne vérifiés.
- [ ] WhatsApp et son éventuel repli Telegram autorisés et validés, ou notifications conservées en mode fictif.
- [ ] `APP_DEBUG=false`, nouvelle `APP_KEY`, secrets présents uniquement dans `.env`, compte MySQL dédié, HTTPS et cookies sécurisés.
- [ ] Compte de test supprimé ; compte client créé avec 2FA vérifiée.
- [ ] Migrations, tests, compilation, sauvegarde et restauration contrôlés.
- [ ] Processus Supervisor, rotation des journaux, alertes de supervision et procédure de retour arrière validés.
- [ ] `ODDS_DRIVER=fake`, `FOOTBALL_DRIVER=fake` et `NOTIFICATION_MODE=fake` conservés tant que chaque pilote réel n’a pas passé son étape de validation dédiée.

## Passage progressif en réel

Le pilote Odds refuse actuellement les scores exacts faute de marché documenté. Le mapper API-Football couvre uniquement les champs du marché live score exact confirmés par les fixtures du client ; les statistiques et les canaux WhatsApp/Telegram restent non vérifiés, sans appels réels. Ne pas mettre le scan en réel par simple changement simultané de variables. Suivre [`PASSER_EN_REEL.md`](./PASSER_EN_REEL.md), valider un pilote à la fois sur un environnement de test, puis documenter la décision avant activation. PronoFoot reste un détecteur : aucune fonction de pari automatique ne doit être ajoutée.
