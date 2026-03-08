/**
 * Endpoint de feed RSS 2.0 para publicaciones (/api/rss.xml)
 *
 * Responsabilidad: leer el frontmatter de todos los artículos en Publicaciones/,
 * construir un documento XML RSS 2.0 válido y devolverlo con el Content-Type correcto.
 *
 * Relaciones:
 * - Lee de: Publicaciones/{slug}/index.mdx (solo frontmatter vía front-matter)
 * - URL canónica base: process.env.NEXT_PUBLIC_SITE_URL
 * - Enlazado desde: src/pages/publicaciones/index.tsx
 */
import fs from 'fs';
import path from 'path';
import frontmatterParser from 'front-matter';

import type { NextApiRequest, NextApiResponse } from 'next';

const DIRECTORIO_PUBLICACIONES = path.join(process.cwd(), 'Publicaciones');

function escaparXml(texto: string): string {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default function handlerRss(_req: NextApiRequest, res: NextApiResponse) {
    const urlBase = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

    let publicaciones: { slug: string; titulo: string; fecha: string; resumen: string }[] = [];

    if (fs.existsSync(DIRECTORIO_PUBLICACIONES)) {
        publicaciones = fs
            .readdirSync(DIRECTORIO_PUBLICACIONES, { withFileTypes: true })
            .filter((entrada) => entrada.isDirectory())
            .map((entrada) => {
                const slug = entrada.name;
                const archivoMdx = path.join(DIRECTORIO_PUBLICACIONES, slug, 'index.mdx');
                if (!fs.existsSync(archivoMdx)) return null;

                const contenido = fs.readFileSync(archivoMdx, 'utf8');
                const { attributes } = frontmatterParser<any>(contenido);

                return {
                    slug,
                    titulo: attributes.titulo ?? slug,
                    fecha: attributes.fecha ?? '',
                    resumen: attributes.resumen ?? '',
                };
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    const items = publicaciones
        .map((pub) => {
            const url = `${urlBase}/publicaciones/${pub.slug}`;
            const fechaRss = pub.fecha ? new Date(pub.fecha).toUTCString() : '';
            return `    <item>
      <title>${escaparXml(pub.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pub.resumen ? `<description>${escaparXml(pub.resumen)}</description>` : ''}
      ${fechaRss ? `<pubDate>${fechaRss}</pubDate>` : ''}
    </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Publicaciones</title>
    <link>${urlBase}/publicaciones</link>
    <description>Artículos y análisis</description>
    <language>es</language>
    <atom:link href="${urlBase}/api/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
}
