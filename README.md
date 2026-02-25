# Netlify Developer Portfolio Starter (auto-annotated)

Landing page personal

- Stack:Next.js, Tailwind CSS, [visual editor](https://docs.netlify.com/visual-editor/overview/) and the [Git Content Source](https://docs.netlify.com/create/content-sources/git/).

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

## Mapeo de Iconos en Secciones Personalizadas

Para mostrar iconos en secciones como `AreasOfInterestSection`, se utiliza un sistema de mapeo basado en el archivo `src/components/svgs/index.js`. Este archivo exporta un objeto `iconMap` que asocia nombres de iconos (por ejemplo, `github`, `mail`, `arrowRight`) con componentes SVG de React.

Para usar un icono, simplemente especifica el nombre correspondiente en el campo `icon` del contenido. Por ejemplo:

```yaml
- icon: github
  title: GitHub
  description: Repositorios y proyectos open source.
```

El componente buscará el icono en `iconMap` y lo renderizará automáticamente. Puedes ver y ampliar la lista de iconos disponibles en `src/components/svgs/index.js`.

## Sistema publicaciones

Las publicaciones viven en el submodule `Publicaciones/` (repo Git separado).
Cada artículo es una carpeta `Publicaciones/{slug}/` con al menos `index.mdx`.

### Flujo de publicación

1. **Escribir el artículo** en Obsidian (o cualquier editor) como `index.mdx`
   dentro de `Publicaciones/{slug}/`.
   El frontmatter obligatorio es:
   ```yaml
   ---
   titulo: Título del artículo
   fecha: "2025-01-15"
   resumen: Descripción breve que aparece en el listado.
   ---
   ```

2. **Generar gráficas** en Jupyter con Plotly y exportarlas al mismo directorio:
   ```python
   fig.write_json("varianza.json")
   fig.write_json("scores.json")
   ```
   Los archivos `.json` se cargan automáticamente en build time.

3. **Usar el componente `<Grafica>`** dentro del MDX para renderizar cada figura:
   ```mdx
   <Grafica src="varianza" altura={400} />
   ```
   El prop `src` es el nombre del archivo sin extensión `.json`.

4. **Publicar**: hacer `git add . && git commit -m "..." && git push` dentro de
   la carpeta `Publicaciones/`. Netlify detecta el cambio vía webhook del
   submodule y reconstruye el sitio automáticamente.

5. Si se actualizó el puntero del submodule en el repo principal, también hacer
   `git push` desde la raíz del proyecto para registrar la nueva referencia.

### Estructura de un artículo

```
Publicaciones/
└── mi-articulo/
    ├── index.mdx        # artículo en MDX con frontmatter
    ├── figura1.json     # datos Plotly exportados con fig.write_json()
    └── figura2.json
```

