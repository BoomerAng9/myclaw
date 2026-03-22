# Odoo — ERP Management
# Chicken Hawk Management Skill

## Mission
Manage the Odoo 17.0 ERP instance on VPS2 (`76.13.96.107` / `vps2`). Odoo handles CRM, invoicing, project management, and business operations for ACHIEVEMOR.

## Target Service
- **Container**: `odoo-odoo-1`
- **Database**: `odoo-odoo-db-1` (Postgres 15)
- **Port**: 8069
- **VPS**: VPS2 (`10.0.0.1` via WireGuard)
- **Compose**: `/opt/odoo/docker-compose.yml`
- **DB Credentials**: User `odoo`, database `odoo`

## Commands

### Health Check
```bash
ssh vps2 "docker ps --filter name=odoo --format '{{.Names}} {{.Status}}'"
ssh vps2 "curl -so /dev/null -w '%{http_code}' http://localhost:8069/"
```

### View Logs
```bash
ssh vps2 "docker logs odoo-odoo-1 --tail 50 2>&1"
```

### Restart
```bash
ssh vps2 "cd /opt/odoo && docker compose restart"
```

### Backup Database
```bash
ssh vps2 "docker exec odoo-odoo-db-1 pg_dump -U odoo odoo | gzip > /opt/odoo/backup-\$(date +%Y%m%d).sql.gz"
```

### Install Module
```bash
ssh vps2 "docker exec odoo-odoo-1 odoo -i <module_name> --db_host odoo-db --db_user odoo --db_password <db_password> --stop-after-init"
```

## Key Odoo Modules for ACHIEVEMOR
- **CRM**: Lead/opportunity management
- **Project**: Task and sprint tracking
- **Invoicing**: Billing and subscription management
- **Website**: Public-facing business pages
- **HR**: Team management (Betty_Anne_Ang integration)

## Access
- Web UI: `http://76.13.96.107:8069` (direct)
- Via WireGuard: `http://10.0.0.1:8069` (from any VPS)
- Future: `odoo.foai.cloud` (after DNS + Traefik setup on VPS2)
