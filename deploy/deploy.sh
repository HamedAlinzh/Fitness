#!/usr/bin/env bash
# One-command deploy. On the VPS, as root:   /var/www/Fitness/deploy/deploy.sh
#
# Order matters: back up first, migrate the database before the new code starts serving,
# and stop on the first failure (set -e) so a broken build never replaces a working site.
set -euo pipefail

APP=/var/www/Fitness
DATA=/var/www/Fitness-data
cd "$APP"

echo "==> backup"
"$APP/deploy/backup-db.sh"

echo "==> fetch code"
git fetch origin main
# The server tree must mirror GitHub. Untracked/ignored files (.env, the database, uploads)
# are not touched by a hard reset.
git reset --hard origin/main

echo "==> dependencies"
npm ci

echo "==> database"
npx prisma generate
npx prisma migrate deploy

echo "==> build"
npm run build

echo "==> assemble standalone"
# `next build` standalone output does not include public/ or .next/static.
STANDALONE="$APP/.next/standalone"
cp -r public "$STANDALONE/"
mkdir -p "$STANDALONE/.next"
cp -r .next/static "$STANDALONE/.next/"
cp .env "$STANDALONE/.env"

# Uploads live outside the build output, so a rebuild can never delete them.
mkdir -p "$DATA/uploads"
rm -rf "$STANDALONE/public/uploads"
ln -sfn "$DATA/uploads" "$STANDALONE/public/uploads"

echo "==> restart"
# delete + start (not reload) so changed settings such as HOSTNAME really apply.
pm2 delete Fitness 2>/dev/null || true
pm2 start "$APP/deploy/ecosystem.config.cjs"
pm2 save

echo "==> smoke test"
sleep 3
for path in / /en /about /en/pricing; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  echo "$path -> $code"
  [ "$code" = "200" ] || { echo "smoke test failed on $path"; exit 1; }
done
echo "deployed $(git rev-parse --short HEAD)"
