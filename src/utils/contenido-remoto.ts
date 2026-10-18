/**
 * src/utils/contenido-remoto.ts — Cuerpo de página leído de una URL externa.
 *
 * Responsabilidad: si una página tiene en su frontmatter `contenidoRemoto`
 * (URL que devuelve Markdown), sustituye su `markdownContent` por lo que
 * devuelve esa URL. Sirve para que la ficha de un proyecto se mantenga en el
 * README de su repo y no aquí. Si la URL falla, se queda el cuerpo del .md
 * como respaldo.
 *
 * Relación con otros módulos:
 *   - src/pages/[[...slug]].tsx: lo llama en getStaticProps y activa ISR
 *     (revalidate) en las páginas que lo usan.
 *   - .stackbit/models/ProjectLayout.ts: declara el campo `contenidoRemoto`.
 *   - Ejemplo: content/pages/projects/growsave*.md → GET /api/ficha del repo
 *     TFM (app/routers/ficha.py), que extrae la sección "Ficha" del README.
 */

// Cada cuánto se regenera una página con contenido remoto (segundos)
export const REVALIDAR_CONTENIDO_REMOTO = 3600;

const TIEMPO_MAXIMO_MS = 5000;

/**
 * Descarga el Markdown de `pagina.contenidoRemoto` y lo pone en
 * `pagina.markdownContent`. Devuelve true si la página usa contenido remoto
 * (haya ido bien o no la descarga).
 */
export async function aplicarContenidoRemoto(pagina: Record<string, any>): Promise<boolean> {
    const url = pagina?.contenidoRemoto;
    if (typeof url !== 'string' || !url) {
        return false;
    }
    try {
        const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });
        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }
        const markdown = (await respuesta.text()).trim();
        if (markdown) {
            pagina.markdownContent = markdown;
        }
    } catch (error) {
        console.warn(`[contenidoRemoto] No se pudo leer ${url}; se usa el cuerpo local.`, error);
    }
    return true;
}
