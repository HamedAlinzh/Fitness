#!/usr/bin/env bash
# Daily backup of the SQLite database and uploaded media. Run by /etc/cron.d/fitness-backup
# (installed by deploy/setup-server.sh) and by deploy.sh before every deploy.
set -euo pipefail

DATA=/var/www/Fitness-data
DB=/var/www/Fitness/prisma/dev.db
STAMP=$(date +%Y%m%d-%H%M%S)
DEST="$DATA/backups"
mkdir -p "$DEST"

# `.backup` is the online-safe way to copy a SQLite file that the app may be writing to;
# a plain `cp` can capture a half-written page.
sqlite3 "$DB" ".backup '$DEST/db-$STAMP.sqlite'"
gzip -f "$DEST/db-$STAMP.sqlite"

if [ -n "$(ls -A "$DATA/uploads" 2>/dev/null)" ]; then
  tar -czf "$DEST/uploads-$STAMP.tgz" -C "$DATA" uploads
fi

# Keep a month of database backups and two weeks of upload archives.
find "$DEST" -name 'db-*.sqlite.gz' -mtime +30 -delete
find "$DEST" -name 'uploads-*.tgz' -mtime +14 -delete
echo "backup ok: $DEST/db-$STAMP.sqlite.gz"
