/**
 * [[...slug]].tsx — páginas de contenido de la landing (home, info, proyectos), en/es.
 * SSG desde content/pages (+ ISR si la página usa contenidoRemoto).
 * SEO: título/descripción desde utils/seo-utils.js y canonical/hreflang/OG/JSON-LD
 * desde components/atoms/MetaSeo.
 */
import Head from 'next/head';
import { useRouter } from 'next/router';

import MetaSeo from '@/components/atoms/MetaSeo';
import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent, leerPublicacionesParaFeed } from '@/utils/content';
import { aplicarContenidoRemoto, REVALIDAR_CONTENIDO_REMOTO } from '@/utils/contenido-remoto';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';
import { URL_SITIO } from '@/utils/sitio';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

/** Datos estructurados (schema.org) según la página: persona en la home, app en la ficha de GrowSave. */
function datosEstructurados(ruta: string, descripcion: string | null) {
    if (ruta === '/') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Yannick Laguna',
            url: URL_SITIO,
            jobTitle: 'Economist',
            description: descripcion || undefined,
            sameAs: ['https://github.com/YannickLaguna']
        };
    }
    if (ruta.replace(/\/$/, '') === '/projects/growsave') {
        return {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'GrowSave',
            url: 'https://growsave.ylaguna.com',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            description: descripcion || undefined,
            author: { '@type': 'Person', name: 'Yannick Laguna', url: URL_SITIO }
        };
    }
    return null;
}

const Page: React.FC<PageComponentProps> = (props) => {
    const { global, ...page } = props;
    const { site } = global || {};
    const { locale } = useRouter();
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);
    // urlPath ya viene sin idioma ("/", "/info", "/projects/growsave")
    const ruta = (page as any).__metadata?.urlPath || '/';

    return (
        <>
            <MetaSeo
                ruta={ruta}
                idioma={locale || 'en'}
                descripcion={metaDescription}
                tipo={ruta === '/' ? 'profile' : 'website'}
                jsonLd={datosEstructurados(ruta, metaDescription)}
            />
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site?.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <DynamicComponent {...page} global={global} />
        </>
    );
};

export function getStaticPaths({ locales }) {
    const paths = [];
    const allLocales = locales || ['en'];

    allLocales.forEach(locale => {
        const allData = allContent(locale);
        allData.forEach(obj => {
            if (obj.__metadata.urlPath !== undefined) {
                const slugArr = obj.__metadata.urlPath === '/' ? [] : obj.__metadata.urlPath.slice(1).split('/');
                paths.push({ params: { slug: slugArr }, locale });
                // El editor Stackbit abre /es/index/ para el home (desde urlPath '/es/{slug}' con slug='index')
                if (obj.__metadata.urlPath === '/' && locale === 'es') {
                    paths.push({ params: { slug: ['index'] }, locale: 'es' });
                }
            }
        });
    });

    return { paths, fallback: false };
}

export async function getStaticProps({ params, locale }) {
    const allData = allContent(locale);
    // Mezclar publicaciones MDX para que RecentPostsSection las encuentre
    const publicacionesMdx = leerPublicacionesParaFeed();
    const allDataConPublicaciones = [...allData, ...publicacionesMdx];
    let urlPath = '/' + (params.slug || []).join('/');
    // Stackbit abre /es/index/ para la home; lo remapeamos al urlPath real
    if (urlPath === '/index') urlPath = '/';
    const props = resolveStaticProps(urlPath, allDataConPublicaciones);
    // Páginas con `contenidoRemoto` (p.ej. fichas leídas del README de su repo): ISR cada hora
    if (await aplicarContenidoRemoto(props)) {
        return { props, revalidate: REVALIDAR_CONTENIDO_REMOTO };
    }
    return { props };
}

export default Page;
