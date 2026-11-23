# Landing page personal — ylaguna.com

Web personal de Yannick Laguna (portafolio, proyectos y publicaciones).

- Stack: Next.js (salida standalone) y Tailwind CSS. El contenido vive en `content/` (Markdown/JSON) y sus modelos en `.stackbit/models/` (heredados de la plantilla original; ya no se usa su editor visual).
- Despliegue: Docker en el VPS propio, detrás de Caddy, desde la rama `deploy/vps`. Detalle en `deploy/README.md`.

Servidor de desarrollo:

```txt
npm run dev
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
   la carpeta `Publicaciones/`.

5. Actualizar el puntero del submodule en el repo principal y volver a desplegar
   en el VPS (ver `deploy/README.md`): el sitio se reconstruye en la imagen Docker.

6. Hacer `git push` desde la raíz del proyecto para registrar la nueva referencia.

### Estructura de un artículo

```
Publicaciones/
└── mi-articulo/
    ├── index.mdx        # artículo en MDX con frontmatter
    ├── figura1.json     # datos Plotly exportados con fig.write_json()
    └── figura2.json
```

