/**
 * Responsabilidad: Genera archivos Markdown de tipo PostLayout en content/pages/blog/
 * a partir de los notebooks (.ipynb) publicados en el repositorio GitHub YannickLaguna/Notebooks.
 *
 * Se ejecuta como prebuild (antes de cada `npm run build`) para que Next.js incluya
 * los posts en el SSG. También puede ejecutarse manualmente con:
 *   node scripts/generate-blog-from-notebooks.js
 *
 * Relacionado con:
 *   - src/components/layouts/PostLayout.tsx  (layout que renderiza cada post)
 *   - content/pages/blog/index.es.md         (índice del blog, tipo PostFeedLayout)
 *   - scripts/generate-notebooks-feed.js     (script hermano que genera ProjectLayout pages)
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ─── Configuración ────────────────────────────────────────────────────────────

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'yannicklaguna';
const REPO_NAME = 'Notebooks';
const BLOG_DIR = path.join(__dirname, '../content/pages/blog');
const NOTEBOOKS_BASE_URL = 'https://yannicklaguna.github.io/Notebooks/';

// Marca en el frontmatter para identificar posts auto-generados
const GENERATED_MARKER = 'generated: true';

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Convierte el nombre del archivo de un notebook en un título legible.
 * Ejemplo: "AnalisisVentas" → "Analisis Ventas"
 *          "regresion_lineal" → "Regresion Lineal"
 */
function formatearNombreNotebook(nombreArchivo) {
    return nombreArchivo
        .replace(/[-_]/g, ' ')                        // guiones/underscores → espacios
        .replace(/([A-Z])/g, ' $1')                   // CamelCase → espacios
        .replace(/\s+/g, ' ')                         // eliminar espacios múltiples
        .trim()
        .replace(/^./, str => str.toUpperCase());     // primera letra mayúscula
}

/**
 * Convierte el nombre del notebook en un slug URL-friendly.
 * Ejemplo: "AnalisisVentas" → "analisis-ventas"
 */
function generarSlug(nombreArchivo) {
    return nombreArchivo
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')   // todo carácter no alfanumérico → guión
        .replace(/-+/g, '-')           // colapsar guiones múltiples
        .replace(/^-|-$/g, '');        // quitar guiones al inicio/final
}

// ─── GitHub API ───────────────────────────────────────────────────────────────

/**
 * Obtiene la lista de notebooks (.ipynb) del repositorio GitHub.
 * Devuelve un array de objetos con metadatos de cada notebook.
 */
async function obtenerListaNotebooks() {
    const cabecerasRequest = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'blog-from-notebooks-generator'
    };

    // Añadir token si está disponible en variables de entorno (evita rate limit)
    if (process.env.GITHUB_TOKEN) {
        cabecerasRequest['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const respuesta = await axios.get(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents`,
            { headers: cabecerasRequest }
        );

        const notebooks = respuesta.data
            .filter(item => item.type === 'file' && item.name.endsWith('.ipynb'))
            .map(item => ({
                nombre: item.name.replace('.ipynb', ''),
                nombreArchivo: item.name,
                urlHtml: `${NOTEBOOKS_BASE_URL}${encodeURIComponent(item.name.replace('.ipynb', '.html'))}`,
                urlRaw: item.download_url,
                sha: item.sha,
                tamanoBytes: item.size
            }));

        return notebooks;
    } catch (error) {
        if (error.response?.status === 403) {
            console.warn('⚠️  GitHub API rate limit alcanzado. Considera añadir GITHUB_TOKEN al entorno.');
        }
        console.error('Error obteniendo notebooks desde GitHub:', error.message);
        return [];
    }
}

/**
 * Obtiene la fecha del último commit que modificó un archivo en el repositorio.
 * Si no se puede obtener, retorna la fecha actual como fallback.
 */
async function obtenerFechaUltimoCommit(nombreArchivo) {
    const cabecerasRequest = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'blog-from-notebooks-generator'
    };

    if (process.env.GITHUB_TOKEN) {
        cabecerasRequest['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const respuesta = await axios.get(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits`,
            {
                headers: cabecerasRequest,
                params: { path: nombreArchivo, per_page: 1 }
            }
        );

        if (respuesta.data.length > 0) {
            const fechaIso = respuesta.data[0].commit.committer.date;
            return new Date(fechaIso).toISOString().split('T')[0];
        }
    } catch (error) {
        // Fallback silencioso: usar fecha actual
    }

    return new Date().toISOString().split('T')[0];
}

// ─── Generadores de Markdown ──────────────────────────────────────────────────

/**
 * Genera el contenido Markdown (frontmatter + cuerpo) para un post de blog en español.
 * El frontmatter usa PostLayout con generated:true para permitir limpieza automática.
 */
function generarMarkdownES(notebook, fechaCommit) {
    const titulo = formatearNombreNotebook(notebook.nombre);
    const githubUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/master/${encodeURIComponent(notebook.nombreArchivo)}`;

    return `---
type: PostLayout
title: '${titulo}'
date: '${fechaCommit}'
colors: colors-b
excerpt: >-
  Notebook de Jupyter: ${titulo}. Análisis de datos e implementación en Python.
notebookUrl: '${notebook.urlHtml}'
githubUrl: '${githubUrl}'
generated: true
---
`;
}

/**
 * Genera el contenido Markdown (frontmatter + cuerpo) para un post de blog en inglés.
 */
function generarMarkdownEN(notebook, fechaCommit) {
    const titulo = formatearNombreNotebook(notebook.nombre);
    const githubUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/master/${encodeURIComponent(notebook.nombreArchivo)}`;

    return `---
type: PostLayout
title: '${titulo}'
date: '${fechaCommit}'
colors: colors-b
excerpt: >-
  Jupyter Notebook: ${titulo}. Data analysis and model implementation in Python.
notebookUrl: '${notebook.urlHtml}'
githubUrl: '${githubUrl}'
generated: true
---
`;
}

// ─── Limpieza ─────────────────────────────────────────────────────────────────

/**
 * Elimina los archivos Markdown que fueron generados automáticamente en builds anteriores.
 * Identifica los archivos por la presencia de "generated: true" en su frontmatter.
 * Preserva los archivos creados manualmente (index.es.md, index.md, etc.).
 */
function limpiarPostsGenerados() {
    if (!fs.existsSync(BLOG_DIR)) return;

    const archivos = fs.readdirSync(BLOG_DIR);
    let eliminados = 0;

    for (const archivo of archivos) {
        const rutaCompleta = path.join(BLOG_DIR, archivo);
        if (!archivo.endsWith('.md')) continue;

        try {
            const contenido = fs.readFileSync(rutaCompleta, 'utf8');
            if (contenido.includes(GENERATED_MARKER)) {
                fs.unlinkSync(rutaCompleta);
                eliminados++;
            }
        } catch (error) {
            console.warn(`  Advertencia al leer ${archivo}:`, error.message);
        }
    }

    if (eliminados > 0) {
        console.log(`  🗑️  Eliminados ${eliminados} posts generados anteriormente`);
    }
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Orquesta todo el proceso:
 * 1. Limpia posts generados anteriormente
 * 2. Obtiene notebooks desde GitHub API
 * 3. Obtiene fecha del último commit para cada notebook
 * 4. Genera archivos .md y .es.md en content/pages/blog/
 */
async function generarBlogDesdeNotebooks() {
    console.log('\n📓 Generando blog posts desde notebooks de GitHub...');

    // 1. Limpiar posts previos auto-generados
    console.log('🧹 Limpiando posts generados anteriormente...');
    limpiarPostsGenerados();

    // 2. Obtener lista de notebooks
    console.log('🔄 Obteniendo lista de notebooks...');
    const notebooks = await obtenerListaNotebooks();

    if (notebooks.length === 0) {
        console.log('⚠️  No se encontraron notebooks. El blog no tendrá posts auto-generados.');
        return;
    }

    console.log(`✅ Encontrados ${notebooks.length} notebooks:`);
    notebooks.forEach(nb => console.log(`  - ${nb.nombre}`));

    // 3. Crear directorio destino si no existe
    if (!fs.existsSync(BLOG_DIR)) {
        fs.mkdirSync(BLOG_DIR, { recursive: true });
        console.log(`📁 Directorio creado: ${BLOG_DIR}`);
    }

    // 4. Generar archivos para cada notebook
    console.log('\n📝 Generando archivos Markdown...');
    for (const notebook of notebooks) {
        const slug = generarSlug(notebook.nombre);
        const fechaCommit = await obtenerFechaUltimoCommit(notebook.nombreArchivo);

        // Archivo en español
        const contenidoES = generarMarkdownES(notebook, fechaCommit);
        const rutaES = path.join(BLOG_DIR, `${slug}.es.md`);
        fs.writeFileSync(rutaES, contenidoES, 'utf8');

        // Archivo en inglés
        const contenidoEN = generarMarkdownEN(notebook, fechaCommit);
        const rutaEN = path.join(BLOG_DIR, `${slug}.md`);
        fs.writeFileSync(rutaEN, contenidoEN, 'utf8');

        console.log(`  ✅ ${slug}.es.md y ${slug}.md (${fechaCommit})`);
    }

    console.log(`\n🎉 Blog posts generados exitosamente en: ${BLOG_DIR}\n`);
}

// ─── Punto de entrada ─────────────────────────────────────────────────────────

if (require.main === module) {
    generarBlogDesdeNotebooks().catch(error => {
        console.error('❌ Error al generar blog posts:', error.message);
        process.exit(1);
    });
}

module.exports = { generarBlogDesdeNotebooks };
