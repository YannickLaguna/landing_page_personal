import { defineStackbitConfig } from '@stackbit/types';
import type { SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';
import { allModels } from './.stackbit/models';

const config = defineStackbitConfig({
    stackbitVersion: '~0.7.0',
    ssgName: 'nextjs',
    nodeVersion: '18',
    contentSources: [
        new GitContentSource({
            rootPath: __dirname,
            contentDirs: ['content'],
            models: allModels,
            assetsConfig: {
                referenceType: 'static',
                staticDir: 'public',
                uploadDir: 'images',
                publicPath: '/'
            }
        })
    ],
    presetSource: {
        type: 'files',
        presetDirs: ['./.stackbit/presets']
    },
    styleObjectModelName: 'ThemeStyle',
    // siteMap explícito para evitar errores de interpolación de {slug} en Windows.
    // @stackbit/cms-git construye los IDs con path.join() → backslashes en Windows,
    // lo que impide que el CLI extraiga el token {slug} del filePath del modelo
    // (que usa forward slashes). Al definir siteMap manualmente, le decimos al CLI
    // exactamente qué URL corresponde a cada documento.
    siteMap: ({ documents }): SiteMapEntry[] => {
        return documents.flatMap((doc) => {
            // Normalizar a forward slashes para que los regex funcionen en Windows
            const idNormalizado = doc.id.replace(/\\/g, '/');

            // Páginas raíz: content/pages/{slug}.es.md
            let coincidencia = idNormalizado.match(/^content\/pages\/([^/]+)\.es\.md$/);
            if (coincidencia) {
                const slug = coincidencia[1];
                return [{
                    urlPath: slug === 'index' ? '/' : `/es/${slug}`,
                    locale: 'es',
                    isHomePage: slug === 'index',
                    document: doc
                }] as SiteMapEntry[];
            }

            // Posts de blog: content/pages/blog/{slug}.es.md
            coincidencia = idNormalizado.match(/^content\/pages\/blog\/([^/]+)\.es\.md$/);
            if (coincidencia) {
                return [{
                    urlPath: `/es/blog/${coincidencia[1]}`,
                    locale: 'es',
                    document: doc
                }] as SiteMapEntry[];
            }

            return [];
        });
    }
});
export default config;
