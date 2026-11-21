#!/usr/bin/env bash
# One-command deploy. On the VPS, as root:   /var/www/Fitness/deploy/deploy.sh
#
# Order matters: back up first, migrate the database before the new code starts serving,
# and stop on the first failure (set -e) so a broken build never replaces a working site.
set -euo pipefail

APP=/var/www/Fitness
DATA=/var/www/Fitness-data
cd "$APP"

# The reset below can replace this very script. Re-run the freshly fetched copy once, so
# a deploy always follows the steps of the code it is deploying, not of the previous one.
if [ "${DEPLOY_FETCHED:-}" != "1" ]; then
  echo "==> backup"
  "$APP/deploy/backup-db.sh"

  echo "==> fetch code"
  git fetch origin main
  # The server tree must mirror GitHub. Untracked/ignored files (.env, the database, uploads)
  # are not touched by a hard reset.
  git reset --hard origin/main
  DEPLOY_FETCHED=1 exec "$APP/deploy/deploy.sh"
fi

echo "==> dependencies"
# pnpm-lock.yaml is the lockfile; allowBuilds in pnpm-workspace.yaml lets better-sqlite3
# compile its native binding (without it every page 500s on "Could not locate the
# bindings file"). The version matches packageManager in package.json.
PNPM_VERSION=$(node -p "require('./package.json').packageManager.split('@')[1]")
if [ "$(pnpm --version 2>/dev/null)" != "$PNPM_VERSION" ]; then
  npm install -g "pnpm@$PNPM_VERSION"
fi
pnpm install --frozen-lockfile

echo "==> database"
pnpm exec prisma generate
pnpm exec prisma migrate deploy

echo "==> build"
# A stale standalone tree from an npm-era build would otherwise keep its old node_modules.
rm -rf .next/standalone
pnpm run build

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
