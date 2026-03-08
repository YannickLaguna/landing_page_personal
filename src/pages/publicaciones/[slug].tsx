/**
 * Página dinámica de publicación individual
 *
 * Responsabilidad: leer los archivos de la carpeta Publicaciones/{slug}/,
 * procesar el index.mdx con next-mdx-remote, cargar los archivos .json
 * asociados (datos de gráficas) y renderizar el artículo completo con
 * soporte para el componente <Grafica> dentro del MDX.
 *
 * Relaciones:
 * - Lee de: Publicaciones/{slug}/index.mdx y archivos .json del mismo directorio
 * - Usa: BaseLayout, GraficaDataProvider, Grafica, GiscusComments
 * - La configuración global (header/footer) se obtiene de allContent igual que el
 *   resto del sitio, para mantener consistencia visual.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import frontmatterParser from 'front-matter';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeCitation from 'rehype-citation';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import GithubSlugger from 'github-slugger';
import dayjs from 'dayjs';

import BaseLayout from '@/components/layouts/BaseLayout';
import Grafica from '@/components/molecules/Grafica';
import GiscusComments from '@/components/molecules/GiscusComments';
import TablaDContenidos from '@/components/molecules/TablaDContenidos';
import { GraficaDataProvider } from '@/contexts/GraficaDataContext';
import { allContent } from '@/utils/content';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

const DIRECTORIO_PUBLICACIONES = path.join(process.cwd(), 'Publicaciones');

const componentesMdx = { Grafica };

interface FrontmatterPublicacion {
    titulo: string;
    fecha: string;
    resumen?: string;
    /** URL relativa de la imagen Open Graph, p.ej. /images/og/mi-articulo.jpg */
    ogImage?: string;
    /** Etiquetas temáticas; sin uso en UI todavía, reservado para filtros futuros */
    tags?: string[];
    /** false = borrador, no aparece en el índice ni en getStaticPaths */
    published?: boolean;
}

interface Props {
    fuenteMdx: MDXRemoteSerializeResult;
    frontmatter: FrontmatterPublicacion;
    datosGraficas: Record<string, any>;
    encabezados: { nivel: 1 | 2 | 3; texto: string; id: string }[];
    /** URL absoluta de la imagen OG resuelta en servidor (null si no hay ogImage) */
    ogImageUrl: string | null;
    global: any;
    colors: string;
}

export default function PaginaPublicacion({ fuenteMdx, frontmatter, datosGraficas, encabezados, ogImageUrl, global }: Props) {
    const fechaFormateada = dayjs(frontmatter.fecha).format('YYYY-MM-DD');
    const fechaAttr = dayjs(frontmatter.fecha).format('YYYY-MM-DD HH:mm:ss');

    return (
        <>
            <Head>
                <title>{frontmatter.titulo}</title>
                {frontmatter.resumen && <meta name="description" content={frontmatter.resumen} />}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Open Graph */}
                <meta property="og:title" content={frontmatter.titulo} />
                {frontmatter.resumen && <meta property="og:description" content={frontmatter.resumen} />}
                <meta property="og:type" content="article" />
                {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
                {/* Twitter Card */}
                <meta name="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
                <meta name="twitter:title" content={frontmatter.titulo} />
                {frontmatter.resumen && <meta name="twitter:description" content={frontmatter.resumen} />}
                {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
            </Head>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BaseLayout {...({ global } as any)}>
                <article className="px-4 py-14 lg:py-20">
                    {/* Grid principal: 1 col en móvil, 4 cols en xl (artículo=3, TOC=1) */}
                    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-10">

                        {/* Columna artículo: ocupa 4/5 en desktop */}
                        <div className="xl:col-span-4">
                            <div className="mb-6">
                                <a
                                    href="/publicaciones"
                                    className="inline-flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Publicaciones
                                </a>
                            </div>

                            <header className="mb-10 sm:mb-14">
                                <div className="mb-4 text-sm uppercase tracking-wide opacity-60">
                                    <time dateTime={fechaAttr}>{fechaFormateada}</time>
                                </div>
                                <h1 className="text-5xl sm:text-6xl">{frontmatter.titulo}</h1>
                                {frontmatter.resumen && (
                                    <p className="mt-4 text-lg opacity-70">{frontmatter.resumen}</p>
                                )}
                            </header>

                            <div className="prose sm:prose-lg prose-p:text-justify max-w-none">
                                <GraficaDataProvider datos={datosGraficas}>
                                    <MDXRemote {...fuenteMdx} components={componentesMdx} />
                                </GraficaDataProvider>
                            </div>
                        </div>

                        {/* Columna TOC: ocupa 1/4 en desktop, oculto en móvil */}
                        {encabezados.length > 0 && (
                            <aside className="hidden xl:block xl:col-span-1">
                                <TablaDContenidos encabezados={encabezados} />
                            </aside>
                        )}
                    </div>

                    <GiscusComments />
                </article>
            </BaseLayout>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    if (!fs.existsSync(DIRECTORIO_PUBLICACIONES)) {
        return { paths: [], fallback: false };
    }

    // Filtrar borradores: published: false excluye la ruta del build
    const slugsPublicados = fs
        .readdirSync(DIRECTORIO_PUBLICACIONES, { withFileTypes: true })
        .filter((entrada) => entrada.isDirectory())
        .filter((entrada) => {
            const archivoMdx = path.join(DIRECTORIO_PUBLICACIONES, entrada.name, 'index.mdx');
            if (!fs.existsSync(archivoMdx)) return false;
            const { attributes } = frontmatterParser<any>(fs.readFileSync(archivoMdx, 'utf8'));
            const esProd = process.env.NODE_ENV === 'production';
            return !esProd || attributes.published !== false;
        })
        .map((entrada) => entrada.name);

    const localesActivos = locales || ['en'];
    const rutas = localesActivos.flatMap((locale) =>
        slugsPublicados.map((slug) => ({ params: { slug }, locale }))
    );

    return { paths: rutas, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const slug = params?.slug as string;
    const carpetaPublicacion = path.join(DIRECTORIO_PUBLICACIONES, slug);
    const archivoMdx = path.join(carpetaPublicacion, 'index.mdx');

    if (!fs.existsSync(archivoMdx)) {
        return { notFound: true };
    }

    const contenidoMdx = fs.readFileSync(archivoMdx, 'utf8');

    // Preprocesar bib: normalizar saltos de línea, quitar campos problemáticos
    // y añadir clave sintética a entradas anónimas (BibTeX inválido de Zotero)
    const rutaBibOriginal = path.join(process.cwd(), 'Z_library.bib');
    let bibLimpio = fs.readFileSync(rutaBibOriginal, 'utf8');

    // 1. Normalizar CRLF → LF para que los regexes con \n funcionen en Windows
    bibLimpio = bibLimpio.replace(/\r\n/g, '\n');

    // 2. Eliminar campos con rutas locales o contenido que rompe el parser
    bibLimpio = bibLimpio
        .replace(/^\s*file\s*=\s*\{[^{}]*\},?\s*\n/gm, '')
        .replace(/^\s*abstract\s*=\s*\{[\s\S]*?\},?\s*\n/gm, '');

    // 3. Añadir clave sintética a entradas sin clave de citación
    // Patrón: @tipo{ seguido sólo de espacios y salto de línea (sin clave antes)
    let contadorAnonimo = 0;
    bibLimpio = bibLimpio.replace(/@(\w+)\{\s*\n/g, (_match, tipo) => {
        contadorAnonimo++;
        return `@${tipo}{__anonimo_${contadorAnonimo}__,\n`;
    });

    const rutaBibTemp = path.join(os.tmpdir(), 'Z_library_clean.bib');
    fs.writeFileSync(rutaBibTemp, bibLimpio, 'utf8');

    // Extraer encabezados H1/H2/H3 para la tabla de contenidos
    const slugger = new GithubSlugger();
    const encabezados = Array.from(contenidoMdx.matchAll(/^(#{1,3})\s+(.+)$/gm)).map((m) => ({
        nivel: m[1].length as 1 | 2 | 3,
        texto: m[2].trim(),
        id: slugger.slug(m[2].trim()),
    }));

    // Preprocesar MDX: eliminar líneas de tarea de Obsidian ("- [ ] ...")
    // y convertir wiki-links ([[Texto]]) a texto plano
    const contenidoMdxLimpio = contenidoMdx
        .split('\n')
        .filter((linea) => !/^\s*-\s*\[\s*\]\s*/.test(linea))
        .join('\n')
        .replace(/\[\[([^\]]+)\]\]/g, '$1');

    const fuenteMdx = await serialize(contenidoMdxLimpio, {
        parseFrontmatter: true,
        mdxOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [
                rehypeKatex,
                rehypeSlug,
                [rehypeCitation, { bibliography: 'Z_library_clean.bib', path: os.tmpdir(), csl: 'apa' }]
            ]
        }
    });
    const frontmatter = fuenteMdx.frontmatter as unknown as FrontmatterPublicacion;

    // Cargar todos los archivos .json de la carpeta como datos de gráficas
    const datosGraficas: Record<string, any> = {};
    fs.readdirSync(carpetaPublicacion)
        .filter((archivo) => archivo.endsWith('.json'))
        .forEach((archivo) => {
            const clave = path.basename(archivo, '.json');
            const contenido = fs.readFileSync(path.join(carpetaPublicacion, archivo), 'utf8');
            datosGraficas[clave] = JSON.parse(contenido);
        });

    // Registrar imágenes PNG/JPG/etc. como datos de tipo imagen
    const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    fs.readdirSync(carpetaPublicacion)
        .filter((archivo) => IMAGE_EXTENSIONS.includes(path.extname(archivo).toLowerCase()))
        .forEach((archivo) => {
            const clave = path.basename(archivo, path.extname(archivo));
            if (!datosGraficas[clave]) {
                datosGraficas[clave] = {
                    __tipo: 'imagen',
                    url: `/api/publicaciones/${encodeURIComponent(slug)}/${encodeURIComponent(archivo)}`
                };
            }
        });

    const todosLosContenidos = allContent(locale || 'en');
    const propiedadesGlobales = resolveStaticProps('/', todosLosContenidos);

    // Resolver URL absoluta de la imagen OG para que sea válida en redes sociales
    const urlBase = process.env.NEXT_PUBLIC_SITE_URL ?? '';
    const ogImageUrl = frontmatter.ogImage
        ? `${urlBase}${frontmatter.ogImage}`
        : null;

    return {
        props: {
            fuenteMdx,
            frontmatter,
            datosGraficas,
            encabezados,
            ogImageUrl,
            global: propiedadesGlobales.global,
            colors: 'colors-b',
        },
    };
};
