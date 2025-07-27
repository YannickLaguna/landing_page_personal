const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuración
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'yannicklaguna';
const REPO_NAME = 'Notebooks';
const PROJECTS_DIR = path.join(__dirname, '../content/pages/projects');
const NOTEBOOKS_BASE_URL = 'https://yannicklaguna.github.io/Notebooks/';

// Función para obtener la lista de notebooks desde GitHub API
async function getNotebooksList() {
    try {
        // Obtener el contenido del directorio raíz del repositorio
        const response = await axios.get(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'notebooks-feed-generator'
            }
        });

        // Filtrar solo archivos .ipynb
        const notebooks = response.data
            .filter(item => item.type === 'file' && item.name.endsWith('.ipynb'))
            .map(item => ({
                name: item.name.replace('.ipynb', ''),
                filename: item.name,
                url: `${NOTEBOOKS_BASE_URL}${item.name}`,
                lastModified: item.updated_at,
                size: item.size
            }));

        return notebooks;
    } catch (error) {
        console.error('Error obteniendo notebooks:', error.message);
        return [];
    }
}

// Función para generar el contenido markdown de un proyecto
function generateProjectMarkdown(notebook) {
    const date = new Date(notebook.lastModified).toISOString().split('T')[0];
    
    return `---
type: ProjectLayout
title: ${notebook.name}
colors: colors-a
date: '${date}'
client: Jupyter Notebook
description: >-
  Notebook de Jupyter que demuestra análisis de datos, machine learning y técnicas de optimización. 
  Este proyecto incluye implementaciones prácticas y visualizaciones interactivas.
featuredImage:
  type: ImageBlock
  url: /images/featured-Image1.jpg
  altText: ${notebook.name} - Jupyter Notebook
media:
  type: ImageBlock
  url: /images/featured-Image1.jpg
  altText: ${notebook.name} - Captura de pantalla del notebook
externalUrl: '${notebook.url}'
---

## 📓 ${notebook.name}

Este notebook de Jupyter presenta un análisis completo que incluye:

- **Análisis exploratorio de datos** con visualizaciones interactivas
- **Implementación de algoritmos** de machine learning y optimización
- **Resultados y conclusiones** basados en datos reales
- **Código reproducible** con documentación detallada

### 🔗 Acceso al Notebook

Puedes ver el notebook completo en: [${notebook.name}](${notebook.url})

### 📊 Características

- **Tamaño del archivo:** ${(notebook.size / 1024).toFixed(1)} KB
- **Última actualización:** ${new Date(notebook.lastModified).toLocaleDateString('es-ES')}
- **Tecnologías:** Python, Jupyter, Pandas, NumPy, Matplotlib, Scikit-learn

### 🚀 Cómo usar

1. Haz clic en el enlace del notebook para abrirlo en GitHub Pages
2. Puedes ejecutar el código directamente en Google Colab o Jupyter Lab
3. Descarga el archivo .ipynb para trabajar localmente

---

*Este proyecto es parte de mi colección de notebooks de análisis de datos y machine learning.*
`;
}

// Función para generar el archivo markdown en español
function generateProjectMarkdownES(notebook) {
    const date = new Date(notebook.lastModified).toISOString().split('T')[0];
    
    return `---
type: ProjectLayout
title: ${notebook.name}
colors: colors-a
date: '${date}'
client: Jupyter Notebook
description: >-
  Notebook de Jupyter que demuestra análisis de datos, machine learning y técnicas de optimización. 
  Este proyecto incluye implementaciones prácticas y visualizaciones interactivas.
featuredImage:
  type: ImageBlock
  url: /images/featured-Image1.jpg
  altText: ${notebook.name} - Jupyter Notebook
media:
  type: ImageBlock
  url: /images/featured-Image1.jpg
  altText: ${notebook.name} - Captura de pantalla del notebook
externalUrl: '${notebook.url}'
---

## 📓 ${notebook.name}

Este notebook de Jupyter presenta un análisis completo que incluye:

- **Análisis exploratorio de datos** con visualizaciones interactivas
- **Implementación de algoritmos** de machine learning y optimización
- **Resultados y conclusiones** basados en datos reales
- **Código reproducible** con documentación detallada

### 🔗 Acceso al Notebook

Puedes ver el notebook completo en: [${notebook.name}](${notebook.url})

### 📊 Características

- **Tamaño del archivo:** ${(notebook.size / 1024).toFixed(1)} KB
- **Última actualización:** ${new Date(notebook.lastModified).toLocaleDateString('es-ES')}
- **Tecnologías:** Python, Jupyter, Pandas, NumPy, Matplotlib, Scikit-learn

### 🚀 Cómo usar

1. Haz clic en el enlace del notebook para abrirlo en GitHub Pages
2. Puedes ejecutar el código directamente en Google Colab o Jupyter Lab
3. Descarga el archivo .ipynb para trabajar localmente

---

*Este proyecto es parte de mi colección de notebooks de análisis de datos y machine learning.*
`;
}

// Función principal
async function generateNotebooksFeed() {
    console.log('🔄 Obteniendo lista de notebooks...');
    
    const notebooks = await getNotebooksList();
    
    if (notebooks.length === 0) {
        console.log('❌ No se encontraron notebooks');
        return;
    }
    
    console.log(`✅ Encontrados ${notebooks.length} notebooks:`);
    notebooks.forEach(nb => console.log(`  - ${nb.name}`));
    
    // Crear directorio si no existe
    if (!fs.existsSync(PROJECTS_DIR)) {
        fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    }
    
    // Generar archivos para cada notebook
    for (const notebook of notebooks) {
        const filename = notebook.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Archivo en inglés
        const englishContent = generateProjectMarkdown(notebook);
        const englishPath = path.join(PROJECTS_DIR, `${filename}.md`);
        fs.writeFileSync(englishPath, englishContent);
        
        // Archivo en español
        const spanishContent = generateProjectMarkdownES(notebook);
        const spanishPath = path.join(PROJECTS_DIR, `${filename}.es.md`);
        fs.writeFileSync(spanishPath, spanishContent);
        
        console.log(`✅ Generado: ${filename}.md y ${filename}.es.md`);
    }
    
    console.log('\n🎉 Feed de notebooks generado exitosamente!');
    console.log(`📁 Archivos creados en: ${PROJECTS_DIR}`);
}

// Ejecutar el script
if (require.main === module) {
    generateNotebooksFeed().catch(console.error);
}

module.exports = { generateNotebooksFeed }; 