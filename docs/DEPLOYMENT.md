# DEPLOYMENT

- **Target:** VPS (31.97.133.29)
- **Profile:** Docker Compose with Traefik router routing `app.myclaw.foai.cloud` to OpenClaw, intercepting `/api/auth` to NemoClaw, and intercepting assets to `foai-assets-nginx`.
