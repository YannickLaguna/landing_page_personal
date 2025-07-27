---
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
    subtitle: "Explora mis últimos proyectos y notebooks de Jupyter"
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
  - type: NotebooksSection
    title: "📓 Notebooks de Jupyter"
    subtitle: "Análisis de datos, machine learning y optimización"
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
---
