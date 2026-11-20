#!/usr/bin/env bash
# PronoFoot — script de déploiement, à lancer sur le serveur après récupération du code dans /var/www/pronofoot.
# Il ne récupère pas le code : le mécanisme de livraison (git pull, archive...) est à convenir avec le client.
# Usage : sudo -u www-data bash deploy/deploy.sh   (puis, en root : supervisorctl restart pronofoot-scan pronofoot-queue)
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/pronofoot}"
PHP="${PHP:-/usr/bin/php}"
cd "$APP_DIR"

if [[ ! -f backend/.env ]]; then
  echo "backend/.env manquant : partir de deploy/.env.production.example." >&2
  exit 1
fi
if grep -qE '^APP_DEBUG=true' backend/.env || grep -qE '^APP_ENV=local' backend/.env; then
  echo "backend/.env n'est pas configuré pour la production (APP_DEBUG ou APP_ENV)." >&2
  exit 1
fi
if grep -qE '^APP_KEY=$' backend/.env; then
  echo "APP_KEY est vide : php artisan key:generate --show, puis la copier dans backend/.env." >&2
  exit 1
fi

# Fichiers créés modifiables par le groupe (www-data et le compte de déploiement se partagent le dépôt).
umask 002

# www-data n'a pas de dossier personnel accessible en écriture (/var/www appartient à root) : caches de composer et
# de npm dans un dossier temporaire, supprimé à la fin.
DEPLOY_TMP="$(mktemp -d "${TMPDIR:-/tmp}/pronofoot-deploy.XXXXXX")"
export HOME="$DEPLOY_TMP" COMPOSER_HOME="$DEPLOY_TMP/composer" npm_config_cache="$DEPLOY_TMP/npm"
cleanup() {
  rm -rf "$DEPLOY_TMP"
}
trap cleanup EXIT

# composer et npm réécrivent vendor/ et node_modules/ : leurs fichiers doivent être modifiables par le groupe.
chmod -R g+w backend/vendor frontend/node_modules backend/public/admin-assets backend/bootstrap/cache 2>/dev/null || true
blocked="$(find backend/vendor frontend/node_modules backend/public/admin-assets backend/bootstrap/cache \
  ! -perm -g+w ! -user "$(id -un)" 2>/dev/null | head -n 3 || true)"
if [[ -n "$blocked" ]]; then
  echo "Fichiers non modifiables par le groupe, par exemple :" >&2
  echo "$blocked" >&2
  echo "Les rendre modifiables une fois, avec leur propriétaire : chmod -R g+w backend/vendor frontend/node_modules" >&2
  exit 1
fi

bring_up() {
  (cd "$APP_DIR/backend" && "$PHP" artisan up)
}

echo "1/7 Mode maintenance"
(cd backend && "$PHP" artisan down --retry=30) || true
trap 'bring_up; cleanup' EXIT

echo "2/7 Dépendances PHP"
(cd backend && composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader)

echo "3/7 Compilation de l'interface (obligatoire : app.js et app.css ne sont pas dans Git)"
(cd frontend && npm ci && npm run build)
rm -f backend/public/admin-assets/hot
test -f backend/public/admin-assets/app.js
test -f backend/public/admin-assets/app.css

echo "4/7 Migrations"
(cd backend && "$PHP" artisan migrate --force)

echo "5/7 Caches de production"
(cd backend && "$PHP" artisan config:cache && "$PHP" artisan route:cache && "$PHP" artisan view:cache)

echo "6/7 Arrêt propre du scan et de la file (Supervisor les relance)"
(cd backend && "$PHP" artisan scan:stop && "$PHP" artisan queue:restart)

echo "7/7 Fin de la maintenance"
bring_up
trap cleanup EXIT

echo "Déploiement terminé. Vérifier : supervisorctl status, page https://.../login, Journal de l'administration."
