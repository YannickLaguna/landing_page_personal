---
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
    subtitle: Explore my latest projects
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
    title: Let's talk... 💬
    colors: colors-f
    form:
      type: FormBlock
      elementId: sign-up-form
      fields:
        - name: firstName
          label: Number
          hideLabel: true
          placeholder: Nombre
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: lastName
          label: Last name
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
          label: Message
          hideLabel: true
          placeholder: Cuéntame sobre tu proyecto
          isRequired: true
          width: full
          type: TextareaFormControl
        - name: updatesConsent
          label: Subscribe to receive my words
          isRequired: false
          width: full
          type: CheckboxFormControl
      submitLabel: Enviar 🚀
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
