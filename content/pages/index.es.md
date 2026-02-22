---
type: PageLayout
title: Inicio
colors: colors-b
sections:
  - type: HeroSection
    title: Yannick Laguna
    subtitle: 'Apasionado por las finanzas, el análisis, y la resolución de problemas'
    actions:
      - type: Button
        label: Póngase en contacto
        altText: ''
        url: 'https://cal.com/ylaguna'
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
    media:
      type: ImageBlock
      url: /images/_LOS1552.jpg
      altText: Hero image
      caption: Pie de foto
      elementId: ''
    colors: colors-b
    backgroundSize: full
    elementId: ''
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-36
          - pb-48
          - pl-4
          - pr-4
        flexDirection: row
        textAlign: left
  - type: AreasOfInterestSection
    title: Áreas de interés
    subtitle: Algunas de las cosas en las que me encanta trabajar.
    interests:
      - icon: optimizacion
        title: Optimización
        description: >-
          Reduzco costos y maximizo resultados identificando ineficiencias
          operativas. Implemento modelos matemáticos y algoritmos que optimizan
          el uso de recursos y aumentan la rentabilidad de tu organización.
      - icon: dashboard
        title: Business Intelligence
        description: >-
          Transformo datos complejos en insights accionables que impulsan
          decisiones estratégicas. Desde dashboards interactivos hasta análisis
          predictivos, ayudo a las organizaciones a descubrir patrones ocultos y
          oportunidades de crecimiento en sus datos.
      - icon: brain
        title: Machine Learning
        description: >-
          Desarrollo soluciones de ML personalizadas que van más allá de
          herramientas básicas. Me encanta tanto la matemática y la teoría tanto
          como la implementación.
      - icon: cog
        title: Automatización
        description: >-
          Elimino tareas repetitivas y optimizo workflows. Libero tiempo valioso
          de tu equipo para que lo dediques a lo que realmente importa.
      - icon: chart
        title: Análisis de datos
        description: >-
          Convierto datos complejos en historias que impulsan la acción. Creo
          presentaciones y reportes que comunican insights de manera clara para
          stakeholders de todos los niveles.
    colors: colors-f
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: center
  - colors: colors-f
    type: FeaturedProjectsSection
    elementId: ''
    actions:
      - type: Link
        label: See all projects
        url: /projects
    showDate: false
    showDescription: true
    showFeaturedImage: true
    showReadMoreLink: true
    variant: variant-b
    projects:
      - content\pages\projects\growsave.es.md
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: left
    subtitle: ''
    title: Proyectos
  - type: NotebooksSection
    title: "\U0001F4D3 Notebooks de Jupyter"
    subtitle: 'Análisis de datos, machine learning y optimización'
    maxItems: 6
    colors: colors-f
    styles:
      self:
        width: narrow
        padding:
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        textAlign: center
  - type: FeaturedPostsSection
    elementId: ''
    colors: colors-f
    variant: variant-d
    subtitle: ''
    showFeaturedImage: false
    actions:
      - type: Link
        label: Ver todas las publicaciones
        url: /blog
    posts:
      - content\pages\blog\aaaa.es.md
    showDate: true
    showExcerpt: true
    showReadMoreLink: true
    styles:
      self:
        height: auto
        width: narrow
        padding:
          - pt-28
          - pb-48
          - pl-4
          - pr-4
        textAlign: left
    title: Publicaciones
---
