# Nginx Routing Notes

Current baseline:

- Use `myclaw-nginx.conf` as the only repo-managed nginx config for the legacy host-level routes.
- `push-phase6.ps1` already deploys `myclaw-nginx.conf`.

Current OpenClaw rule:

- Do not add `app.myclaw.foai.cloud` to nginx while the plain OpenClaw stack is active.
- The current OpenClaw deployment owns that hostname through Traefik in the live Hostinger stack.
- Auth for `app.myclaw.foai.cloud` is handled by the running OpenClaw/Traefik configuration, not by nginx.

Why the old variants were removed:

- `myclaw-nginx-noauth.conf` targeted an old NemoClaw/OpenShell path and cleared `Authorization` headers.
- `myclaw-nginx-revert.conf` was incomplete relative to `myclaw-nginx.conf` and no longer represented a safe rollback target.

If an alternate routing mode is needed later:

1. Start from `myclaw-nginx.conf`.
2. Confirm whether nginx or Traefik is the owner of the hostname you want to change.
3. Confirm the actual upstream container or host port before adding a new `server` block.
4. Keep auth ownership in one layer only. Do not split auth between nginx and Traefik without a deliberate migration plan.

Safe rule of thumb:

- Nginx manages the legacy site routes in this repo.
- Traefik manages the current OpenClaw app route.
