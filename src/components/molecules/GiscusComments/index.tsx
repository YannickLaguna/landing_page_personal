/**
 * GiscusComments
 *
 * Responsabilidad: renderizar el widget de comentarios de Giscus al pie de cada post.
 * Los comentarios se almacenan en GitHub Discussions del repositorio del proyecto.
 *
 * Relaciones:
 * - Usado por: src/components/layouts/PostLayout/index.tsx
 * - Depende de: Next.js router (para detectar idioma), script externo de giscus.app
 *
 * Configuración necesaria antes de usar:
 *   1. Activar GitHub Discussions en el repo: Settings → Features → Discussions
 *   2. Visitar https://giscus.app, generar configuración y reemplazar las constantes
 *      GISCUS_REPO_ID y GISCUS_CATEGORY_ID con los valores obtenidos.
 */

'use client';

import { useRouter } from 'next/router';
import * as React from 'react';

// ─── Configuración de Giscus ────────────────────────────────────────────────
// Sustituir con los valores de https://giscus.app
const GISCUS_REPO = 'YannickLaguna/landing_page_personal';
const GISCUS_REPO_ID = 'R_kgDOPG1_4Q';
const GISCUS_CATEGORY = 'Announcements';
const GISCUS_CATEGORY_ID = 'DIC_kwDOPG1_4c4C3A5i';
// ────────────────────────────────────────────────────────────────────────────

interface GiscusCommentsProps {
    /** Tema visual del widget. Por defecto sigue el esquema del sistema operativo. */
    tema?: 'preferred_color_scheme' | 'light' | 'dark' | 'transparent_dark';
}

/**
 * Widget de comentarios Giscus montado exclusivamente en el cliente.
 * Usa useEffect para inyectar el script de Giscus una única vez al montar el componente.
 * El idioma se detecta automáticamente desde el locale de Next.js.
 */
const GiscusComments: React.FC<GiscusCommentsProps> = ({ tema = 'preferred_color_scheme' }) => {
    const { locale } = useRouter();
    const contenedorRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const contenedor = contenedorRef.current;
        if (!contenedor) return;

        // Eliminar script previo para evitar duplicados al navegar entre posts
        const scriptPrevio = contenedor.querySelector('script[src*="giscus.app"]');
        if (scriptPrevio) scriptPrevio.remove();

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';

        script.setAttribute('data-repo', GISCUS_REPO);
        script.setAttribute('data-repo-id', GISCUS_REPO_ID);
        script.setAttribute('data-category', GISCUS_CATEGORY);
        script.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', tema);
        script.setAttribute('data-lang', locale === 'es' ? 'es' : 'en');
        script.setAttribute('data-loading', 'lazy');

        contenedor.appendChild(script);
    }, [locale, tema]);

    return (
        <div
            ref={contenedorRef}
            className="max-w-3xl mx-auto mt-12 pt-8 border-t border-current/20"
        />
    );
};

export default GiscusComments;
