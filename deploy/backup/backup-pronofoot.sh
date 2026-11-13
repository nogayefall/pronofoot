#!/usr/bin/env bash
# PronoFoot — sauvegarde quotidienne de la base MySQL.
# Installation : cp backup-pronofoot.sh /usr/local/sbin/ && chmod 750 /usr/local/sbin/backup-pronofoot.sh
# Planification (root), chaque jour à 3 h 30 :
#   echo '30 3 * * * root /usr/local/sbin/backup-pronofoot.sh' > /etc/cron.d/pronofoot-backup
# Le mot de passe reste dans /etc/pronofoot/mysql-backup.cnf (chmod 600), jamais dans ce script.
set -euo pipefail
umask 077

BACKUP_DIR="${BACKUP_DIR:-/var/backups/pronofoot}"
DB_NAME="${DB_NAME:-pronofoot}"
CREDENTIALS="${CREDENTIALS:-/etc/pronofoot/mysql-backup.cnf}"
# Durée de conservation en jours : à confirmer avec le client. Vide = aucune suppression automatique.
RETENTION_DAYS="${RETENTION_DAYS:-}"

mkdir -p "$BACKUP_DIR"
timestamp="$(date +%F-%H%M)"
target="$BACKUP_DIR/${DB_NAME}-${timestamp}.sql.gz"

mysqldump --defaults-extra-file="$CREDENTIALS" \
  --single-transaction --quick --routines --triggers --events \
  "$DB_NAME" | gzip -9 > "$target.partial"
mv "$target.partial" "$target"

# Vérifie que l'archive est lisible avant de la considérer valide.
gzip -t "$target"
sha256sum "$target" > "$target.sha256"

if [[ -n "$RETENTION_DAYS" ]]; then
  find "$BACKUP_DIR" -name "${DB_NAME}-*.sql.gz*" -type f -mtime +"$RETENTION_DAYS" -delete
fi

logger -t pronofoot-backup "Sauvegarde réussie : $target"

# Restauration (hors production d'abord) :
#   gunzip -c pronofoot-AAAA-MM-JJ-HHMM.sql.gz | mysql --defaults-extra-file=/etc/pronofoot/mysql-backup.cnf pronofoot_restauration
