/**
 * Índice de publicaciones (/publicaciones)
 *
 * Responsabilidad: listar todas las publicaciones del submodule Publicaciones/,
 * leyendo el frontmatter de cada index.mdx en build time y pasándolo a
 * PostFeedSection con el mismo formato que usaba el blog, para mantener
 * el mismo look & feel.
 *
 * Relaciones:
 * - Lee de: Publicaciones/{slug}/index.mdx (solo frontmatter, no el cuerpo MDX)
 * - Reutiliza: PostFeedSection, DynamicComponent (HeroSection), BaseLayout
 * - Cada entrada enlaza a: /publicaciones/{slug}
 */
import fs from 'fs';
import path from 'path';
import frontmatterParser from 'front-matter';

import { GetStaticProps } from 'next';
import Head from 'next/head';

import { DynamicComponent } from '@/components/components-registry';
import BaseLayout from '@/components/layouts/BaseLayout';
import PostFeedSection from '@/components/sections/PostFeedSection';
import { allContent } from '@/utils/content';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

const DIRECTORIO_PUBLICACIONES = path.join(process.cwd(), 'Publicaciones');

interface ResumenPublicacion {
    // Estructura compatible con PostFeedSection para reutilizar el componente sin cambios
    __metadata: { urlPath: string };
    title: string;
    date: string;
    excerpt: string;
}

interface Props {
    publicaciones: ResumenPublicacion[];
    global: any;
    colors: string;
}

export default function PaginaPublicaciones({ publicaciones, global }: Props) {
    return (
        <>
            <Head>
                <title>Publicaciones</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BaseLayout {...({ global } as any)}>
                {/* Hero idéntico al del blog */}
                <div className="relative">
                    <DynamicComponent
                        {...({
                            type: 'HeroSection',
                            title: 'Publicaciones',
                            subtitle: '',
                            actions: [],
                            colors: 'colors-f',
                            backgroundSize: 'full',
                            elementId: '',
                            styles: {
                                self: {
                                    height: 'auto',
                                    width: 'narrow',
                                    padding: ['pt-16', 'pb-16', 'pl-4', 'pr-4'],
                                    flexDirection: 'row',
                                    textAlign: 'left'
                                }
                            }
                        } as any)}
                    />
                    <a
                        href="/api/rss.xml"
                        title="Feed RSS"
                        className="absolute top-16 right-4 opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Feed RSS"
                    >
                        {/* Icono RSS redondo */}
                        <img src="/images/rss-round.svg" alt="RSS" className="w-5 h-5" />
                    </a>
                </div>
                {/* Lista de publicaciones con el mismo estilo variant-d del blog */}
                <PostFeedSection
                    colors="colors-f"
                    showDate={true}
                    showAuthor={false}
                    showExcerpt={true}
                    showFeaturedImage={false}
                    showReadMoreLink={true}
                    variant="variant-d"
                    posts={publicaciones}
                    styles={{
                        self: {
                            width: 'narrow',
                            padding: ['pt-0', 'pl-4', 'pr-4', 'pb-12']
                        }
                    }}
                />
            </BaseLayout>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    if (!fs.existsSync(DIRECTORIO_PUBLICACIONES)) {
        return { props: { publicaciones: [], global: null } };
    }

    // Leer el frontmatter de cada index.mdx sin procesar el cuerpo MDX completo
    const publicaciones: ResumenPublicacion[] = fs
        .readdirSync(DIRECTORIO_PUBLICACIONES, { withFileTypes: true })
        .filter((entrada) => entrada.isDirectory())
        .map((entrada) => {
            const slug = entrada.name;
            const archivoMdx = path.join(DIRECTORIO_PUBLICACIONES, slug, 'index.mdx');
            if (!fs.existsSync(archivoMdx)) return null;

            const contenido = fs.readFileSync(archivoMdx, 'utf8');
            const { attributes } = frontmatterParser<any>(contenido);

            // Excluir borradores: en producción published: false oculta la entrada
            const esProd = process.env.NODE_ENV === 'production';
            if (esProd && attributes.published === false) return null;

            return {
                __metadata: { urlPath: `/publicaciones/${slug}` },
                title: attributes.titulo ?? slug,
                date: attributes.fecha ?? '',
                excerpt: attributes.resumen ?? '',
            };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const todosLosContenidos = allContent(locale || 'en');
    const propiedadesGlobales = resolveStaticProps('/', todosLosContenidos);

    return {
        props: {
            publicaciones,
            global: propiedadesGlobales.global,
            colors: 'colors-b',
        },
    };
};
