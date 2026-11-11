/**
 * MetaSeo — etiquetas SEO comunes de cada página (dentro de next/head).
 *
 * Responsabilidad: canonical, hreflang (en/es/x-default), Open Graph (og:url,
 * og:site_name, og:locale, og:type, og:description) y Twitter Card, más un bloque
 * JSON-LD opcional (datos estructurados para Google).
 * - `ruta`: ruta SIN prefijo de idioma (p.ej. "/info/").
 * - `idiomaCanonico`: si la página solo existe de verdad en un idioma (las
 *   publicaciones están en español aunque se sirvan en /x y /es/x), el canonical
 *   apunta a ese idioma y no se emiten hreflang.
 * Relación: utils/sitio.ts (URLs), pages/[[...slug]].tsx y pages/publicaciones/*.
 */
import Head from 'next/head';

import { IDIOMAS, LOCALE_OG, urlEnIdioma } from '@/utils/sitio';

interface PropsMetaSeo {
    ruta: string;
    idioma: string;
    descripcion?: string | null;
    tipo?: 'website' | 'article' | 'profile';
    idiomaCanonico?: string;
    jsonLd?: Record<string, unknown> | null;
}

export default function MetaSeo({ ruta, idioma, descripcion, tipo = 'website', idiomaCanonico, jsonLd }: PropsMetaSeo) {
    const canonical = urlEnIdioma(ruta, idiomaCanonico || idioma);
    return (
        <Head>
            <link rel="canonical" href={canonical} key="canonical" />
            {!idiomaCanonico &&
                IDIOMAS.map((alt) => <link key={`hreflang-${alt}`} rel="alternate" hrefLang={alt} href={urlEnIdioma(ruta, alt)} />)}
            {!idiomaCanonico && <link rel="alternate" hrefLang="x-default" href={urlEnIdioma(ruta, 'en')} key="hreflang-xd" />}
            <meta property="og:url" content={canonical} key="og:url" />
            <meta property="og:site_name" content="Yannick Laguna" key="og:site_name" />
            <meta property="og:locale" content={LOCALE_OG[idioma] || 'en_US'} key="og:locale" />
            <meta property="og:type" content={tipo} key="og:type" />
            {descripcion && <meta property="og:description" content={descripcion} key="og:description" />}
            <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    key="jsonld"
                    // JSON generado por nosotros (no entrada de usuario); se escapa "<" por seguridad
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
                />
            )}
        </Head>
    );
}
