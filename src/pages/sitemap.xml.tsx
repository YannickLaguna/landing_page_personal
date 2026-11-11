/**
 * Página /sitemap.xml (getServerSideProps escribe el XML; no renderiza React).
 *
 * Responsabilidad: generar el sitemap XML para Google Search Console con
 * - las páginas de contenido (content/pages) en inglés y español, enlazadas entre sí
 *   con xhtml:link hreflang;
 * - el índice y las publicaciones (Publicaciones/), solo en su versión canónica /es/.
 * Relación: utils/content.ts (allContent, allPages, leerPublicacionesParaFeed),
 * utils/sitio.ts (URLs), public/robots.txt (declara este sitemap).
 */
import type { GetServerSideProps } from 'next';

import { allContent, allPages, leerPublicacionesParaFeed } from '@/utils/content';
import { IDIOMAS, urlEnIdioma } from '@/utils/sitio';

function escaparXml(texto: string): string {
    return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function entrada(loc: string, alternativas: { idioma: string; url: string }[] = [], lastmod?: string): string {
    const enlaces = alternativas
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.idioma}" href="${escaparXml(a.url)}"/>`)
        .join('\n');
    return [
        '  <url>',
        `    <loc>${escaparXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
        enlaces,
        '  </url>'
    ]
        .filter(Boolean)
        .join('\n');
}

function generarSitemap(): string {
    // Rutas de contenido (sin idioma) que existen en todos los idiomas
    const rutasPorIdioma = IDIOMAS.map(
        (idioma) => new Set(allPages(allContent(idioma)).map((p) => p.__metadata.urlPath).filter((r) => r && r !== '/index'))
    );
    const rutasComunes = [...rutasPorIdioma[0]].filter((r) => rutasPorIdioma.every((s) => s.has(r))).sort();

    const urls: string[] = [];
    for (const ruta of rutasComunes) {
        const alternativas: { idioma: string; url: string }[] = IDIOMAS.map((idioma) => ({ idioma, url: urlEnIdioma(ruta, idioma) }));
        alternativas.push({ idioma: 'x-default', url: urlEnIdioma(ruta, 'en') });
        for (const idioma of IDIOMAS) urls.push(entrada(urlEnIdioma(ruta, idioma), alternativas));
    }

    // Publicaciones: escritas en español, una sola URL canónica
    urls.push(entrada(urlEnIdioma('/publicaciones/', 'es')));
    for (const pub of leerPublicacionesParaFeed() as any[]) {
        urls.push(entrada(urlEnIdioma(pub.__metadata.urlPath, 'es'), [], pub.date || undefined));
    }

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...urls,
        '</urlset>'
    ].join('\n');

    return xml;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.write(generarSitemap());
    res.end();
    return { props: {} };
};

export default function Sitemap() {
    return null;
}
