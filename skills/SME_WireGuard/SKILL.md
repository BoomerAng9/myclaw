# WireGuard — VPN Mesh Management
# Chicken Hawk Management Skill

## Mission
Manage the WireGuard full-mesh VPN connecting all 3 VPS machines. The mesh provides encrypted private communication so services can reach each other without public exposure.

## Network Topology
```
VPS1 (AIMS)          VPS2 (Compute)        VPS3 (Chicken Hawk)
31.97.138.45         76.13.96.107          31.97.133.29
10.0.0.2             10.0.0.1              10.0.0.3
aims-vps             vps2                  myclaw-vps
srv1318308           srv1328075            srv1492108

10.0.0.2 ←→ 10.0.0.1 ←→ 10.0.0.3  (full mesh, all peers)
```

## Public Keys
- **VPS1**: `A2otU3thz1Q5swA2qH/h/YZWymBhMuIBbUl4GqW5uR8=`
- **VPS2**: `lc5pzpFiZVpErrIFzlRADRMhPcCtaN4Rz0BL9TNr6m8=`
- **VPS3**: `nuUVTaqndv2ZImK+LdZ5ExCY4JVAVlSYpfYaj/E9V04=`

## Commands

### Check Full Mesh Status
```bash
# From any VPS, check tunnel status:
ssh aims-vps "wg show wg0"
ssh vps2 "wg show wg0"
ssh myclaw-vps "wg show wg0"
```

### Verify All 6 Ping Directions
```bash
ssh myclaw-vps "ping -c 1 10.0.0.2 && ping -c 1 10.0.0.1"
ssh aims-vps "ping -c 1 10.0.0.1 && ping -c 1 10.0.0.3"
ssh vps2 "ping -c 1 10.0.0.2 && ping -c 1 10.0.0.3"
```

### Add a New Peer
On the new machine:
```bash
apt-get install -y wireguard wireguard-tools
wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
```
On each existing peer:
```bash
wg set wg0 peer <NEW_PUBLIC_KEY> endpoint <NEW_IP>:51820 allowed-ips 10.0.0.X/32 persistent-keepalive 25
# Then append [Peer] block to /etc/wireguard/wg0.conf for persistence
```

### Remove a Peer
```bash
wg set wg0 peer <PUBLIC_KEY> remove
# Then remove the [Peer] block from /etc/wireguard/wg0.conf
```

### Restart WireGuard
```bash
systemctl restart wg-quick@wg0
```

## Configuration Paths
- Config: `/etc/wireguard/wg0.conf`
- Private key: `/etc/wireguard/privatekey` (mode 600)
- Public key: `/etc/wireguard/publickey`
- Firewall: `ufw allow 51820/udp`
- Service: `systemctl enable wg-quick@wg0`

## Service Access via WireGuard
| Service | VPS | WireGuard URL |
|---------|-----|--------------|
| AIMS Frontend | VPS1 | `http://10.0.0.2:80` |
| OpenSandbox | VPS1 | `http://10.0.0.2:4400` |
| Plug Engine | VPS1 | `http://10.0.0.2:4200` |
| Odoo | VPS2 | `http://10.0.0.1:8069` |
| NemoClaw Gateway | VPS2 | `https://10.0.0.1:8080` |
| ii-agent | VPS2 | `http://10.0.0.1:1420` |
| LibreChat | VPS2 | `http://10.0.0.1:32769` |
| OpenClaw | VPS3 | `http://10.0.0.3:18789` |
| SimStudio | VPS3 | `http://10.0.0.3:32769` |
