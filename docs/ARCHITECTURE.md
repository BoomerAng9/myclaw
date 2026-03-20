# ARCHITECTURE: Chicken Hawk (A.I.M.S.)

- **Frontend:** OpenClaw (LobeChat fork) modified to serve Chicken Hawk branding.
- **Auth Proxy:** NemoClaw intercepting OpenClaw's auth.
- **Asset Proxy:** Nginx proxy serving custom Chicken Hawk iconography and the dynamic 'Lil_Hawks' agent marketplace.
- **Infrastructure:** Docker Compose on Hostinger VPS behind Traefik.
