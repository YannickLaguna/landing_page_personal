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
import path from 'path';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';

import BaseLayout from '@/components/layouts/BaseLayout';
import Grafica from '@/components/molecules/Grafica';
import GiscusComments from '@/components/molecules/GiscusComments';
import { GraficaDataProvider } from '@/contexts/GraficaDataContext';
import { allContent } from '@/utils/content';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

const DIRECTORIO_PUBLICACIONES = path.join(process.cwd(), 'Publicaciones');

const componentesMdx = { Grafica };

interface FrontmatterPublicacion {
    titulo: string;
    fecha: string;
    resumen?: string;
}

interface Props {
    fuenteMdx: MDXRemoteSerializeResult;
    frontmatter: FrontmatterPublicacion;
    datosGraficas: Record<string, any>;
    global: any;
    colors: string;
}

export default function PaginaPublicacion({ fuenteMdx, frontmatter, datosGraficas, global }: Props) {
    const fechaFormateada = dayjs(frontmatter.fecha).format('YYYY-MM-DD');
    const fechaAttr = dayjs(frontmatter.fecha).format('YYYY-MM-DD HH:mm:ss');

    return (
        <>
            <Head>
                <title>{frontmatter.titulo}</title>
                {frontmatter.resumen && <meta name="description" content={frontmatter.resumen} />}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BaseLayout {...({ global } as any)}>
                <article className="px-4 py-14 lg:py-20">
                    <div className="max-w-5xl mx-auto mb-6">
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

                    <header className="max-w-5xl mx-auto mb-10 sm:mb-14">
                        <div className="mb-4 text-sm uppercase tracking-wide opacity-60">
                            <time dateTime={fechaAttr}>{fechaFormateada}</time>
                        </div>
                        <h1 className="text-5xl sm:text-6xl">{frontmatter.titulo}</h1>
                        {frontmatter.resumen && (
                            <p className="mt-4 text-lg opacity-70">{frontmatter.resumen}</p>
                        )}
                    </header>

                    <div className="max-w-3xl mx-auto prose sm:prose-lg">
                        <GraficaDataProvider datos={datosGraficas}>
                            <MDXRemote {...fuenteMdx} components={componentesMdx} />
                        </GraficaDataProvider>
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

    const carpetas = fs
        .readdirSync(DIRECTORIO_PUBLICACIONES, { withFileTypes: true })
        .filter((entrada) => entrada.isDirectory())
        .map((entrada) => entrada.name);

    const localesActivos = locales || ['en'];
    const rutas = localesActivos.flatMap((locale) =>
        carpetas.map((slug) => ({ params: { slug }, locale }))
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
    const fuenteMdx = await serialize(contenidoMdx, { parseFrontmatter: true });
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

    const todosLosContenidos = allContent(locale || 'en');
    const propiedadesGlobales = resolveStaticProps('/', todosLosContenidos);

    return {
        props: {
            fuenteMdx,
            frontmatter,
            datosGraficas,
            global: propiedadesGlobales.global,
            colors: 'colors-b',
        },
    };
};
