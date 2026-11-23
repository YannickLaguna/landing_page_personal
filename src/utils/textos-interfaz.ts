/**
 * textos-interfaz.ts — Textos fijos de la interfaz en los dos idiomas de la landing (es/en).
 *
 * Responsabilidad: un único sitio para las etiquetas que no vienen del contenido
 * (botones, enlaces de vuelta, títulos de la tabla de contenidos). Así no se
 * quedan textos en español escritos a mano dentro de los componentes.
 * Relación: lo usan components/layouts/ProjectLayout, components/molecules/TablaDContenidos
 * y pages/publicaciones/[slug].tsx; el idioma activo sale de `router.locale`
 * (contexts/LanguageContext, i18n de next.config.js).
 */

/** Diccionario de textos: cada clave tiene su versión en español y en inglés. */
const TEXTOS = {
    proyectos: { es: 'Proyectos', en: 'Projects' },
    verProyecto: { es: 'Ver proyecto', en: 'View project' },
    publicaciones: { es: 'Publicaciones', en: 'Publications' },
    enEstaPagina: { es: 'En esta página', en: 'On this page' }
} as const;

export type ClaveTexto = keyof typeof TEXTOS;

/**
 * Devuelve el texto de `clave` en el idioma `idioma`. Cualquier idioma que no sea
 * español cae en inglés, que es el idioma por defecto del sitio.
 */
export function textoInterfaz(clave: ClaveTexto, idioma: string | undefined): string {
    return idioma === 'es' ? TEXTOS[clave].es : TEXTOS[clave].en;
}
