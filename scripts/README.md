# 📓 Sistema de Sincronización de Notebooks

Este directorio contiene scripts y componentes para sincronizar automáticamente los notebooks de Jupyter desde el repositorio [yannicklaguna/Notebooks](https://github.com/yannicklaguna/Notebooks) con la sección de proyectos del sitio web personal.

## 🎯 Solución Implementada

### **Enfoque Híbrido: Markdown + Componente Dinámico**

Hemos implementado una **solución híbrida** que combina lo mejor de ambos mundos:

1. **Páginas estáticas en Markdown** → Para contenido que no cambia frecuentemente
2. **Componente dinámico** → Para mostrar notebooks en tiempo real desde la API de GitHub

## 🚀 Componentes Disponibles

### 1. `NotebooksSection` (Componente Dinámico)
**Ubicación:** `src/components/sections/NotebooksSection/`

**Características:**
- ✅ **Tiempo real:** Consume directamente la API de GitHub
- ✅ **Sin archivos estáticos:** No requiere generar archivos markdown
- ✅ **Actualización automática:** Los notebooks se actualizan automáticamente
- ✅ **Diseño responsivo:** Grid adaptativo con Tailwind CSS
- ✅ **Estados de carga:** Loading, error y empty states
- ✅ **Integración con Stackbit:** Compatible con el editor visual

**Uso en Markdown:**
```yaml
- type: NotebooksSection
  title: "📓 Notebooks de Jupyter"
  subtitle: "Análisis de datos, machine learning y optimización"
  maxItems: 6
  colors: colors-f
```

### 2. `generate-notebooks-feed.js` (Script de Generación)
Genera archivos markdown individuales para cada notebook (opcional).

**Funcionalidades:**
- Obtiene la lista de notebooks desde la API de GitHub
- Crea archivos `.md` e `.es.md` para cada notebook
- Incluye metadatos completos
- Genera enlaces directos a los notebooks

**Uso:**
```bash
npm run generate-notebooks
```

### 3. `update-projects-page.js` (Script de Actualización)
Actualiza las páginas principales de proyectos.

**Uso:**
```bash
npm run update-projects
```

## 🔄 Automatización

### GitHub Actions
El workflow `.github/workflows/sync-notebooks.yml` se ejecuta:

- **Diariamente** a las 6:00 AM UTC
- **Manual** desde la pestaña Actions
- **Automático** cuando se actualiza el repositorio de notebooks

### Comandos Disponibles

```bash
# Generar archivos markdown de notebooks
npm run generate-notebooks

# Actualizar páginas de proyectos
npm run update-projects

# Sincronización completa
npm run sync-notebooks
```

## 📁 Estructura de Archivos

```
src/components/sections/NotebooksSection/
├── index.tsx                    # Componente principal
└── README.md                   # Documentación

.stackbit/models/
├── NotebooksSection.ts         # Modelo de Stackbit
└── index.ts                    # Registro de modelos

content/pages/projects/
├── index.md                    # Página principal (EN)
├── index.es.md                 # Página principal (ES)
└── [notebooks generados]       # Archivos markdown (opcional)
```

## 🎨 Características del Componente

### Diseño Visual
- **Grid responsivo:** 1 columna en móvil, 2 en tablet, 3 en desktop
- **Cards con hover:** Efectos de sombra y transiciones
- **Iconos SVG:** Flechas y enlaces externos
- **Estados visuales:** Loading spinner, mensajes de error

### Información Mostrada
- **Título del notebook**
- **Descripción general**
- **Fecha de última actualización**
- **Tamaño del archivo**
- **Enlace directo** al notebook en GitHub Pages

### Configuración
- **Número máximo de notebooks** a mostrar
- **Título y subtítulo** personalizables
- **Colores** del tema
- **Estilos** de layout

## 🔧 Configuración

### Variables del Componente
```typescript
interface NotebooksSectionProps {
    title?: string;           // Título de la sección
    subtitle?: string;        // Subtítulo descriptivo
    maxItems?: number;        // Máximo número de notebooks (1-12)
    colors?: string;          // Esquema de colores
    styles?: object;          // Estilos personalizados
}
```

### Configuración de API
```javascript
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'yannicklaguna';
const REPO_NAME = 'Notebooks';
const NOTEBOOKS_BASE_URL = 'https://yannicklaguna.github.io/Notebooks/';
```

## 🛠️ Personalización

### Modificar el Diseño
Edita `src/components/sections/NotebooksSection/index.tsx`:

```tsx
// Cambiar el número de columnas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Modificar los colores
className="bg-blue-600 hover:bg-blue-700"

// Añadir más información
<p>Tamaño: {(notebook.size / 1024).toFixed(1)} KB</p>
```

### Añadir Nuevos Campos
1. Actualiza la interfaz `Notebook`
2. Modifica el mapeo de datos
3. Añade los campos al modelo de Stackbit

## 📝 Ventajas de la Solución Híbrida

### ✅ Ventajas del Componente Dinámico
- **Actualización automática** sin intervención manual
- **Sin archivos estáticos** que mantener
- **Tiempo real** desde la API de GitHub
- **Menos complejidad** en el mantenimiento

### ✅ Ventajas del Markdown
- **SEO optimizado** para contenido estático
- **Edición visual** en Stackbit Studio
- **Control total** sobre el contenido
- **Backup** de información importante

## 🐛 Solución de Problemas

### Error de Rate Limiting
```bash
# La API de GitHub tiene límites de 60 requests/hora para IPs no autenticadas
# Solución: Esperar unos minutos y reintentar
```

### Componente No Se Muestra
1. Verifica que `NotebooksSection` esté registrado en `components-registry.tsx`
2. Confirma que el modelo esté en `allModels` en `.stackbit/models/index.ts`
3. Revisa la consola del navegador para errores de JavaScript

### Errores de CORS
```javascript
// El componente usa fetch() que puede tener problemas de CORS
// Solución: Usar proxy o configurar CORS en el servidor
```

## 🚀 Próximos Pasos

### Mejoras Sugeridas
1. **Caché local:** Implementar localStorage para reducir llamadas a la API
2. **Filtros:** Añadir filtros por categoría o fecha
3. **Búsqueda:** Implementar búsqueda en tiempo real
4. **Paginación:** Para repositorios con muchos notebooks
5. **Autenticación:** Usar token de GitHub para mayor rate limit

### Integración con Stackbit Studio
- El componente es completamente editable en Stackbit Studio
- Permite personalizar título, subtítulo y número de items
- Mantiene la consistencia visual con el resto del sitio

## 📞 Soporte

Para problemas o mejoras:
1. Revisa los logs de la consola del navegador
2. Verifica la conectividad con la API de GitHub
3. Comprueba que el repositorio sea público
4. Crea un issue en el repositorio

---

*Esta solución proporciona la mejor experiencia tanto para desarrolladores como para usuarios finales, combinando la flexibilidad del contenido dinámico con la estabilidad del contenido estático.* 