# Traefik — Reverse Proxy & TLS Management
# Chicken Hawk Management Skill

## Mission
Manage Traefik reverse proxy across the VPS infrastructure. Traefik handles host-based routing, automatic Let's Encrypt TLS certificates, and service discovery via Docker labels.

## Target Service
- **Container**: `traefik-traefik-1`
- **VPS**: VPS3 (`31.97.133.29` / `myclaw-vps`)
- **Entrypoints**: `web` (80), `websecure` (443)
- **Cert Resolver**: `letsencrypt`

## Managed Routes
| Domain | Service | VPS |
|--------|---------|-----|
| `app.myclaw.foai.cloud` | OpenClaw (Chicken Hawk) | VPS3 |
| `chicken-hawk.myclaw.foai.cloud` | Chicken Hawk alt | VPS3 |
| `studio.myclaw.foai.cloud` | ACHEEVY Studio | VPS3 |
| `myclaw.foai.cloud` | MyClaw site | VPS3 |
| `klass.foai.cloud` / `ok.foai.cloud` | OKai | VPS3 |
| `perform.foai.cloud` | Per\|Form | VPS1 |
| `blockwise.foai.cloud` | Blockwise | VPS1 |
| `partners.foai.cloud` | Partners | VPS1 |
| `foai.cloud` / `www.foai.cloud` | FOAI landing | VPS3 |

## Commands

### Health Check
```bash
ssh myclaw-vps "docker ps --filter name=traefik --format '{{.Names}} {{.Status}}'"
```

### View Active Routes
```bash
ssh myclaw-vps "docker exec traefik-traefik-1 traefik healthcheck 2>&1"
```

### View Access Logs
```bash
ssh myclaw-vps "docker logs traefik-traefik-1 --tail 30"
```

### Check Certificates
```bash
ssh myclaw-vps "docker exec traefik-traefik-1 cat /letsencrypt/acme.json | python3 -c 'import json,sys; d=json.load(sys.stdin); [print(c[\"domain\"][\"main\"]) for c in d.get(\"letsencrypt\",{}).get(\"Certificates\",[])]'"
```

## Routing Architecture
- Nginx manages legacy site routes (see `myclaw-nginx.conf`)
- Traefik manages current app routes via Docker labels
- Auth ownership must stay in ONE layer — never split between nginx and Traefik
- All services use `websecure` entrypoint with Let's Encrypt TLS
