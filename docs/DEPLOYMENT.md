# DEPLOYMENT

- **Target:** VPS (31.97.133.29)
- **Profile:** Docker Compose with Traefik router routing `app.myclaw.foai.cloud` to OpenClaw, intercepting `/api/auth` to NemoClaw, and intercepting assets to `foai-assets-nginx`.

## OpenClaw Env Contract

- OpenClaw compose reads its runtime variables from the repo-root `.env` file.
- The canonical template is `.env.example` at the repo root.
- Keep the live VPS file limited to the approved OpenClaw key set from that template.
- Removed providers and legacy aliases should stay out of the live `.env` unless there is an explicit migration window.
