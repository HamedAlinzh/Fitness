// PM2 definition for the Fitness site. Started by deploy/deploy.sh.
//
// HOSTNAME=localhost makes the standalone Next server listen on loopback only, so the
// only way in from the internet is nginx (HTTPS). Without it port 3000 is reachable
// directly over plain HTTP. It must be "localhost", not "127.0.0.1": Next derives the
// request's origin from this value, and src/proxy.ts rewrites to a URL on
// localhost:3000 — with any other value Next treats the rewrite as an external proxy
// request and Persian (unprefixed) pages 500. Secrets (DATABASE_URL, ADMIN_SESSION_SECRET, …) are not here:
// they come from /var/www/Fitness/.env, which deploy.sh copies next to server.js.
module.exports = {
  apps: [
    {
      name: "Fitness",
      cwd: "/var/www/Fitness/.next/standalone",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "localhost",
      },
    },
  ],
};
