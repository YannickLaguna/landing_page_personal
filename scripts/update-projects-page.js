const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuración
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'yannicklaguna';
const REPO_NAME = 'Notebooks';
const PROJECTS_INDEX_PATH = path.join(__dirname, '../content/pages/projects/index.md');
const PROJECTS_INDEX_ES_PATH = path.join(__dirname, '../content/pages/projects/index.es.md');
const NOTEBOOKS_BASE_URL = 'https://yannicklaguna.github.io/Notebooks/';

// Función para obtener la lista de notebooks
async function getNotebooksList() {
    try {
        const response = await axios.get(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'notebooks-feed-generator'
            }
        });

        const notebooks = response.data
            .filter(item => item.type === 'file' && item.name.endsWith('.ipynb'))
            .map(item => ({
                name: item.name.replace('.ipynb', ''),
                filename: item.name,
                url: `${NOTEBOOKS_BASE_URL}${item.name.replace('.ipynb', '.html')}`,
                lastModified: item.updated_at,
                size: item.size
            }))
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)); // Ordenar por fecha

        return notebooks;
    } catch (error) {
        console.error('Error obteniendo notebooks:', error.message);
        return [];
    }
}



// Función para actualizar la página de proyectos en inglés
function updateProjectsPage(notebooks) {
    const content = `---
type: ProjectFeedLayout
title: Projects
colors: colors-f
projectFeed:
  type: ProjectFeedSection
  colors: colors-f
  showDate: true
  showDescription: true
  showReadMoreLink: true
  showFeaturedImage: true
  variant: variant-a
  styles:
    self:
      width: narrow
      padding:
        - pt-0
        - pl-4
        - pr-4
        - pb-12
topSections:
  - type: HeroSection
    title: Projects
    subtitle: "Explore my latest projects"
    actions: []
    colors: colors-f
    backgroundSize: full
    elementId: ''
    styles:
      self:
        height: auto
        width: narrow
        padding:
          - pt-16
          - pb-16
          - pl-4
          - pr-4
        flexDirection: row
        textAlign: center
bottomSections:
  - type: ContactSection
    backgroundSize: full
    title: "Let's talk... 💬"
    colors: colors-f
    form:
      type: FormBlock
      elementId: sign-up-form
      fields:
        - name: firstName
          label: First Name
          hideLabel: true
          placeholder: First Name
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: lastName
          label: Last Name
          hideLabel: true
          placeholder: Last Name
          isRequired: false
          width: 1/2
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Email
          isRequired: true
          width: full
          type: EmailFormControl
        - name: message
          label: Message
          hideLabel: true
          placeholder: Tell me about your project
          isRequired: true
          width: full
          type: TextareaFormControl
        - name: updatesConsent
          label: Sign me up to recieve my words
          isRequired: false
          width: full
          type: CheckboxFormControl
      submitLabel: "Submit 🚀"
      styles:
        self:
          textAlign: center
    styles:
      self:
        height: auto
        width: narrow
        margin:
          - mt-0
          - mb-0
          - ml-4
          - mr-4
        padding:
          - pt-24
          - pb-24
          - pr-4
          - pl-4
        flexDirection: row
        textAlign: left
---`;

    fs.writeFileSync(PROJECTS_INDEX_PATH, content);
}

// Función para actualizar la página de proyectos en español
function updateProjectsPageES(notebooks) {
    const content = `---
type: ProjectFeedLayout
title: Proyectos
colors: colors-f
projectFeed:
  type: ProjectFeedSection
  colors: colors-f
  showDate: true
  showDescription: true
  showReadMoreLink: true
  showFeaturedImage: true
  variant: variant-a
  styles:
    self:
      width: narrow
      padding:
        - pt-0
        - pl-4
        - pr-4
        - pb-12
topSections:
  - type: HeroSection
    title: Proyectos
    subtitle: "Explora mis últimos proyectos"
    actions: []
    colors: colors-f
    backgroundSize: full
    elementId: ''
    styles:
      self:
        height: auto
        width: narrow
        padding:
          - pt-16
          - pb-16
          - pl-4
          - pr-4
        flexDirection: row
        textAlign: center
bottomSections:
  - type: ContactSection
    backgroundSize: full
    title: "Hablemos... 💬"
    colors: colors-f
    form:
      type: FormBlock
      elementId: sign-up-form
      fields:
        - name: firstName
          label: Nombre
          hideLabel: true
          placeholder: Nombre
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: lastName
          label: Apellido
          hideLabel: true
          placeholder: Apellido
          isRequired: false
          width: 1/2
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Email
          isRequired: true
          width: full
          type: EmailFormControl
        - name: message
          label: Mensaje
          hideLabel: true
          placeholder: Cuéntame sobre tu proyecto
          isRequired: true
          width: full
          type: TextareaFormControl
        - name: updatesConsent
          label: Suscríbeme para recibir mis palabras
          isRequired: false
          width: full
          type: CheckboxFormControl
      submitLabel: "Enviar 🚀"
      styles:
        self:
          textAlign: center
    styles:
      self:
        height: auto
        width: narrow
        margin:
          - mt-0
          - mb-0
          - ml-4
          - mr-4
        padding:
          - pt-24
          - pb-24
          - pr-4
          - pl-4
        flexDirection: row
        textAlign: left
---`;

    fs.writeFileSync(PROJECTS_INDEX_ES_PATH, content);
}

// Función principal
async function updateProjectsPages() {
    console.log('🔄 Obteniendo lista de notebooks para actualizar páginas...');
    
    const notebooks = await getNotebooksList();
    
    if (notebooks.length === 0) {
        console.log('❌ No se encontraron notebooks');
        return;
    }
    
    console.log(`✅ Encontrados ${notebooks.length} notebooks para destacar`);
    
    // Actualizar páginas
    updateProjectsPage(notebooks);
    updateProjectsPageES(notebooks);
    
    console.log('✅ Páginas de proyectos actualizadas exitosamente!');
    console.log(`📄 Archivos actualizados:`);
    console.log(`  - ${PROJECTS_INDEX_PATH}`);
    console.log(`  - ${PROJECTS_INDEX_ES_PATH}`);
}

// Ejecutar el script
if (require.main === module) {
    updateProjectsPages().catch(console.error);
}

module.exports = { updateProjectsPages }; 