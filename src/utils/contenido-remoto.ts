/**
 * src/utils/contenido-remoto.ts — Cuerpo de página leído de una URL externa.
 *
 * Responsabilidad: si una página tiene en su frontmatter `contenidoRemoto`
 * (URL que devuelve Markdown), sustituye su `markdownContent` por lo que
 * devuelve esa URL. Sirve para que la ficha de un proyecto se mantenga en el
 * README de su repo y no aquí. Si la URL falla, se queda el cuerpo del .md
 * como respaldo.
 *
 * Si además tiene `seccionesRemotas` (lista de títulos `## …`), solo se
 * conservan esas secciones, en su orden original, y se descarta el texto
 * anterior al primer `##` (la intro). Así el README completo sigue en GitHub
 * y la landing enseña solo lo que interesa.
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
 * Filtra un Markdown por secciones de nivel 2: conserva solo las `## Título`
 * cuyo título está en `titulos` (sin distinguir mayúsculas), con su contenido
 * hasta el siguiente `## `. El texto previo al primer `## ` se descarta.
 * Si ninguna coincide devuelve el Markdown original, para no dejar la página vacía.
 */
export function filtrarSecciones(markdown: string, titulos: string[]): string {
    const buscados = new Set(titulos.map((titulo) => titulo.trim().toLowerCase()));
    // Trozos que empiezan por "## " (el primero puede ser la intro sin título)
    const trozos = markdown.split(/^(?=## )/m);
    const conservados = trozos.filter((trozo) => {
        const cabecera = trozo.match(/^## (.+)$/m);
        return trozo.startsWith('## ') && cabecera && buscados.has(cabecera[1].trim().toLowerCase());
    });
    return conservados.length ? conservados.map((trozo) => trozo.trim()).join('\n\n') : markdown;
}

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
            const secciones = pagina?.seccionesRemotas;
            pagina.markdownContent =
                Array.isArray(secciones) && secciones.length ? filtrarSecciones(markdown, secciones) : markdown;
        }
    } catch (error) {
        console.warn(`[contenidoRemoto] No se pudo leer ${url}; se usa el cuerpo local.`, error);
    }
    return true;
}
