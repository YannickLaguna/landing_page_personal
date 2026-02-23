# Netlify Developer Portfolio Starter (auto-annotated)

Landing page personal
- Stack:Next.js, Tailwind CSS, [visual editor](https://docs.netlify.com/visual-editor/overview/) and the [Git Content Source](https://docs.netlify.com/create/content-sources/git/).

The codebase showcases **how to apply annotations at scale**, meaning: how to make much of your components [highlightable in the visual editor](https://docs.netlify.com/visual-editor/visual-editing/inline-editor/) through data attributes without manually adding code throughout the codebase.

**This is achieved by:**

1. Adding an annotation property to the content objects at they're loaded (see `src/utils/content.ts`)
1. When rendering the page, each content sub-object is dynamically matched to the appropriate component. At this point, wrap each component with an annotation, based on the abovementioned content property. See `src/components/components-registry.tsx`.

Run the Next.js development server:

```txt
cd ...
npm run dev
```

```txt
stackbit dev
```

## Scripts: usar con npm run nombre_script 
- recogidos en package.json

## Dependencias Comentadas

### Dependencias deshabilitadas temporalmente:
- `react-syntax-highlighter`: Para resaltado de sintaxis en bloques de código (actualmente deshabilitado por problemas de compatibilidad con versiones recientes)
- `@types/react-syntax-highlighter`: Tipos de TypeScript para react-syntax-highlighter

Para reactivar estas dependencias en el futuro:
1. Descomenta las líneas en `package.json`
2. Ejecuta `npm install`
3. Actualiza `src/utils/highlighted-markdown.tsx` para usar la sintaxis correcta de la versión actual

## Mapeo de Iconos en Secciones Personalizadas

Para mostrar iconos en secciones como `AreasOfInterestSection`, se utiliza un sistema de mapeo basado en el archivo `src/components/svgs/index.js`. Este archivo exporta un objeto `iconMap` que asocia nombres de iconos (por ejemplo, `github`, `mail`, `arrowRight`) con componentes SVG de React.

Para usar un icono, simplemente especifica el nombre correspondiente en el campo `icon` del contenido. Por ejemplo:

```yaml
- icon: github
  title: GitHub
  description: Repositorios y proyectos open source.
```

El componente buscará el icono en `iconMap` y lo renderizará automáticamente. Puedes ver y ampliar la lista de iconos disponibles en `src/components/svgs/index.js`.
