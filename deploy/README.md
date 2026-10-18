# deploy/ — Landing y proxy del VPS (ylaguna.com)

**Responsabilidad:** publicar la landing personal en el VPS (sustituye a Netlify) y alojar el **Caddy compartido** que sirve todos los dominios `*.ylaguna.com`.

| Fichero | Para qué |
|---|---|
| `Dockerfile` | Compila Next.js en modo `standalone` (`next.config.js`) y lo ejecuta con Node 22 en el puerto 3000 |
| `docker-compose.yml` | Servicio `landing`, en la red externa `edge` (sin puertos públicos) |
| `edge/docker-compose.yml` | Caddy: el único contenedor con 80/443 en todo el VPS |
| `edge/Caddyfile` | Tabla dominio → contenedor (`landing:3000`, `growsave-web:8000`) |
| `../.dockerignore` | Deja fuera de la imagen `.git`, `node_modules`, `.env`… |

Relación con otros repos: GrowSave (repo `TFM`, `deploy/docker-compose.prod.yml`) se conecta a la red `edge` con el alias `growsave-web`.

## En el VPS (como `deploy`)

```bash
docker network create edge                                   # una sola vez
git clone --recurse-submodules -b deploy/vps https://github.com/YannickLaguna/landing_page_personal.git /opt/landing
cd /opt/landing
docker compose -f deploy/docker-compose.yml up -d --build    # landing
docker compose -f deploy/edge/docker-compose.yml up -d       # Caddy
```

**Actualizar la landing** (por ejemplo, tras publicar algo nuevo en `Publicaciones`):
```bash
cd /opt/landing && git pull --recurse-submodules && git submodule update --remote
docker compose -f deploy/docker-compose.yml up -d --build
```

**Añadir un dominio o proyecto:** se añade un bloque en `edge/Caddyfile` y luego:
```bash
docker compose -f deploy/edge/docker-compose.yml exec caddy caddy reload --config /etc/caddy/Caddyfile
```

## DNS (Cloudflare, zona ylaguna.com)

| Tipo | Nombre | Valor | Proxy |
|---|---|---|---|
| A | `@` | 169.58.85.148 | gris al principio, luego naranja |
| A | `www` | 169.58.85.148 | gris al principio, luego naranja |
| A | `growsave` | 169.58.85.148 | gris al principio, luego naranja |

Cuando Caddy tenga los certificados, se pasan a naranja y SSL/TLS se pone en **Full (strict)**.
