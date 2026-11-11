/**
 * Analitica — script de Umami (analítica web autoalojada, sin cookies).
 *
 * Responsabilidad: cargar https://stats.ylaguna.com/script.js con el id del sitio.
 * No renderiza nada si faltan NEXT_PUBLIC_UMAMI_URL o NEXT_PUBLIC_UMAMI_WEBSITE_ID
 * (desarrollo, o antes de montar Umami). `data-domains` evita contar visitas de localhost.
 * Los eventos (clic en CTA, ir a GrowSave) se marcan con `data-umami-event` en
 * components/atoms/Action. Relación: _app.js, deploy/Dockerfile (variables en build),
 * CSP de deploy/edge/Caddyfile (permite stats.ylaguna.com).
 */
import Script from 'next/script';

const URL_UMAMI = process.env.NEXT_PUBLIC_UMAMI_URL;
const ID_SITIO_UMAMI = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function Analitica() {
    if (!URL_UMAMI || !ID_SITIO_UMAMI) return null;
    return (
        <Script
            src={`${URL_UMAMI.replace(/\/$/, '')}/script.js`}
            data-website-id={ID_SITIO_UMAMI}
            data-domains="ylaguna.com"
            strategy="afterInteractive"
        />
    );
}
