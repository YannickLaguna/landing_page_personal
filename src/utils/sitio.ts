/**
 * sitio.ts — Datos globales del sitio para SEO (URL pública, idiomas y rutas).
 *
 * Responsabilidad: una única fuente para construir URLs absolutas (canonical,
 * hreflang, og:url, og:image, sitemap y RSS) a partir de NEXT_PUBLIC_SITE_URL,
 * que se fija en la build (deploy/Dockerfile) y vale https://ylaguna.com por defecto.
 * Relación: components/atoms/MetaSeo, utils/seo-utils.js, pages/api/sitemap.ts,
 * pages/api/rss.xml.ts y las páginas de publicaciones.
 */

export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ylaguna.com').replace(/\/$/, '');

/** Idiomas de next.config.js; el primero es el de por defecto (rutas sin prefijo). */
export const IDIOMAS = ['en', 'es'] as const;
export const IDIOMA_POR_DEFECTO = 'en';

/** Locale de Open Graph para cada idioma. */
export const LOCALE_OG: Record<string, string> = { en: 'en_US', es: 'es_ES' };

/**
 * Normaliza una ruta sin idioma: con "/" inicial y final (trailingSlash: true),
 * cada segmento codificado (p.ej. "Movimiento Browniano" → "Movimiento%20Browniano").
 */
export function normalizarRuta(ruta: string): string {
    const segmentos = ruta
        .split('/')
        .filter(Boolean)
        .map((s) => encodeURIComponent(decodeURIComponent(s)));
    return segmentos.length ? `/${segmentos.join('/')}/` : '/';
}

/** URL absoluta de una ruta (sin idioma) en un idioma concreto. */
export function urlEnIdioma(ruta: string, idioma: string): string {
    const prefijo = idioma === IDIOMA_POR_DEFECTO ? '' : `/${idioma}`;
    return `${URL_SITIO}${prefijo}${normalizarRuta(ruta)}`;
}

/** Convierte una ruta relativa ("/images/x.png") en absoluta; deja intactas las absolutas. */
export function urlAbsoluta(ruta: string | null | undefined): string | null {
    if (!ruta) return null;
    if (/^(?:[a-z+]+:)?\/\//i.test(ruta)) return ruta;
    return `${URL_SITIO}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
}
