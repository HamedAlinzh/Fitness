#!/usr/bin/env bash
# Deploy from your own computer with one command:   pnpm ship   (or ./deploy/ship.sh)
#
# Pushes main to GitHub, runs deploy/deploy.sh on the VPS over SSH, then checks the live
# site. The VPS deploys whatever is on origin/main, so this refuses to run when your
# local main isn't exactly what will be deployed (uncommitted changes, another branch,
# or commits on GitHub you haven't pulled).
#
# Needs your SSH key on the server (plain `ssh ubuntu@162.19.255.200` works without a
# password). Override the target with DEPLOY_HOST=user@host.
set -euo pipefail

HOST=${DEPLOY_HOST:-ubuntu@162.19.255.200}
SITE=${DEPLOY_SITE:-https://trainwithparia.com}

cd "$(git rev-parse --show-toplevel)"

fail() { echo "✗ $*" >&2; exit 1; }

echo "==> checking the local repo"
branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" = "main" ] || fail "you're on '$branch'. The server deploys main: merge into main, then run this from main."

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  git status --short --untracked-files=no
  fail "there are uncommitted changes (above). Commit them, or stash them if they shouldn't go live."
fi

untracked=$(git ls-files --others --exclude-standard)
if [ -n "$untracked" ]; then
  echo "  note: these new files are not committed and will NOT be deployed:"
  echo "$untracked" | sed 's/^/    /'
fi

git fetch -q origin main
behind=$(git rev-list --count HEAD..origin/main)
[ "$behind" = "0" ] || fail "GitHub has $behind commit(s) you don't have. Run 'git pull' first."

ahead=$(git rev-list --count origin/main..HEAD)
if [ "$ahead" != "0" ]; then
  echo "==> pushing $ahead commit(s) to GitHub"
  git push origin main
fi

echo "==> checking SSH access to $HOST"
ssh -o BatchMode=yes -o ConnectTimeout=15 "$HOST" true ||
  fail "can't reach $HOST over SSH without a password."

echo "==> deploying $(git rev-parse --short HEAD) on the server (takes a few minutes)"
ssh -o BatchMode=yes "$HOST" "sudo bash /var/www/Fitness/deploy/deploy.sh"

echo "==> checking the live site"
ok=1
for path in / /en /pricing /contact; do
  code=$(curl -s -o /dev/null -m 20 -w "%{http_code}" "$SITE$path" || true)
  echo "  $path -> $code"
  [ "$code" = "200" ] || ok=0
done
[ "$ok" = "1" ] || fail "the server deployed, but the site doesn't answer 200 from outside (Cloudflare / nginx?)."

echo "✓ live: $SITE ($(git rev-parse --short HEAD))"
