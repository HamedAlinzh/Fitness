#!/usr/bin/env bash
# One-time (idempotent) server preparation. On the VPS, as root:
#   sudo bash /var/www/Fitness/deploy/setup-server.sh
# Run it once before the first deploy.sh; running it again changes nothing.
set -euo pipefail

APP=/var/www/Fitness
DATA=/var/www/Fitness-data
SITE=/etc/nginx/sites-enabled/Fitness
SITE_URL_VALUE=https://trainwithparia.com

echo "==> packages"
command -v sqlite3 >/dev/null || apt-get install -y sqlite3

echo "==> data directories"
mkdir -p "$DATA/uploads" "$DATA/backups"
chmod +x "$APP"/deploy/*.sh

echo "==> SITE_URL in .env (canonical + hreflang URLs; read at build time)"
grep -q '^SITE_URL=' "$APP/.env" || echo "SITE_URL=$SITE_URL_VALUE" >> "$APP/.env"

echo "==> nginx: upload limit + real visitor address"
if grep -q client_max_body_size "$SITE"; then
  echo "already patched"
else
  cp -a "$SITE" "/root/nginx-Fitness.$(date +%Y%m%d-%H%M%S).bak"
  python3 - "$SITE" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
old = """        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
"""
new = """        proxy_set_header Host $host;
        # The app counts unique visitors from the client address. Overwrite (not append
        # to) X-Forwarded-For so a visitor cannot forge it.
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin photo/video uploads. nginx defaults to 1MB, below a single phone photo. Kept
    # above the app's own limits (5MB images, 45MB video) so the app can refuse an oversize
    # file with a readable message instead of nginx's bare 413.
    client_max_body_size 60m;
"""
assert old in s, "unexpected nginx config layout - patch it by hand"
open(p, "w").write(s.replace(old, new, 1))
PY
  nginx -t && systemctl reload nginx
fi

echo "==> daily backup (03:30)"
echo "30 3 * * * root $APP/deploy/backup-db.sh >> /var/log/fitness-backup.log 2>&1" \
  > /etc/cron.d/fitness-backup
chmod 644 /etc/cron.d/fitness-backup

echo "setup done. Next: $APP/deploy/deploy.sh"
