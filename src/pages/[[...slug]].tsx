import Head from 'next/head';

import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent, leerPublicacionesParaFeed } from '@/utils/content';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

const Page: React.FC<PageComponentProps> = (props) => {
    const { global, ...page } = props;
    const { site } = global || {};
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);

    return (
        <>
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

export function getStaticProps({ params, locale }) {
    const allData = allContent(locale);
    // Mezclar publicaciones MDX para que RecentPostsSection las encuentre
    const publicacionesMdx = leerPublicacionesParaFeed();
    const allDataConPublicaciones = [...allData, ...publicacionesMdx];
    let urlPath = '/' + (params.slug || []).join('/');
    // Stackbit abre /es/index/ para la home; lo remapeamos al urlPath real
    if (urlPath === '/index') urlPath = '/';
    const props = resolveStaticProps(urlPath, allDataConPublicaciones);
    return { props };
}

export default Page;
