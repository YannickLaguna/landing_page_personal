---
type: ProjectFeedLayout
title: Proyectos
colors: colors-b
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
    subtitle: Explora mis últimos proyectos y notebooks de Jupyter
    actions: []
    colors: colors-f
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
  - type: NotebooksSection
    title: "\U0001F4D3 Notebooks de Jupyter"
    subtitle: 'Análisis de datos, machine learning y optimización'
    maxItems: 6
    colors: colors-f
    styles:
      self:
        width: wide
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: center
bottomSections:
  - type: CtaSection
    title: "Hablemos \U0001F4AC"
    colors: colors-f
    actions:
      - type: Button
        label: Póngase en contacto
        url: 'https://cal.com/ylaguna'
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
    styles:
      self:
        height: auto
        width: narrow
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: center
        flexDirection: col
        alignItems: center
---
