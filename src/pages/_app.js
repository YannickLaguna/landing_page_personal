/**
 * _app.js — Envoltorio común de todas las páginas de la landing.
 *
 * Responsabilidad: variables CSS globales del tema, tema de color en <body>,
 * proveedor de idioma y la analítica (Umami, sin cookies).
 * Las páginas se renderizan también en el servidor (SSG): antes se ocultaban hasta
 * montar en el navegador (`isMounted`), lo que dejaba el HTML vacío para Google y
 * para las vistas previas de redes sociales.
 * Relación: LanguageContext (idioma desde la ruta), theme-style-utils (variables CSS),
 * components/atoms/Analitica (script de Umami).
 */
import { generateGlobalCssVariables } from '@/utils/theme-style-utils';
import { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Analitica from '@/components/atoms/Analitica';
import '../css/main.css';

export default function MyApp({ Component, pageProps }) {
    const { global, ...page } = pageProps;
    const { theme } = global || {};

    const cssVars = generateGlobalCssVariables(theme);

    useEffect(() => {
        document.body.setAttribute('data-theme', page.colors || 'colors-a');
    }, [page.colors]);

    return (
        <LanguageProvider>
            <style jsx global>{`
                :root {
                    ${cssVars}
                }
            `}</style>
            <Analitica />
            <Component {...pageProps} />
        </LanguageProvider>
    );
}
