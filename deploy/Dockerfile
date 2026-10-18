# ============================================================================
# deploy/Dockerfile — Imagen de producción de la landing personal (ylaguna.com)
#
# Responsabilidad: compilar el sitio Next.js (i18n en/es + rutas API) y
# ejecutarlo como servidor Node autocontenido (`output: 'standalone'` en
# next.config.js). Sustituye al despliegue en Netlify.
# Relación con otros módulos:
#   - Contexto de build: la raíz del repo, con el submódulo `Publicaciones`
#     ya descargado (git clone --recurse-submodules). Filtrado por .dockerignore.
#   - Lo construye deploy/docker-compose.yml (servicio `landing`).
#   - Caddy (deploy/edge) le reenvía el tráfico de ylaguna.com al puerto 3000.
#   - En runtime, src/pages/api/publicaciones lee ficheros de ./Publicaciones.
# ============================================================================

# ---------- 1. Build ----------
FROM node:22-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=https://ylaguna.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- 2. Runtime ----------
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Servidor standalone + estáticos (Next no los copia solo en modo standalone)
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Contenido leído desde disco (API de publicaciones y páginas)
COPY --from=builder --chown=node:node /app/Publicaciones ./Publicaciones
COPY --from=builder --chown=node:node /app/content ./content
COPY --from=builder --chown=node:node /app/Z_library.bib ./Z_library.bib

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
