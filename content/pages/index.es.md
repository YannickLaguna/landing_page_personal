---
type: PageLayout
title: Inicio
colors: colors-d
backgroundImage:
  type: BackgroundImage
  url: /images/bg1.jpg
  backgroundSize: cover
  backgroundPosition: center
  backgroundRepeat: no-repeat
  opacity: 75
sections:
  - type: HeroSection
    title: >-
      Soy desarrollador, artista digital, consultor y un montón de otros títulos impresionantes y palabras de moda.
    subtitle: >-
      Esta es mi información—la comparto contigo para impresionarte con todo el trabajo duro que he hecho en los últimos años. Una vez que estés impresionado, puedes seguir bajando para ver más detalles y credenciales sobre mí.
    actions:
      - type: Button
        label: Contrátame
        altText: ''
        url: /
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: ''
    media:
      type: ImageBlock
      url: /images/_LOS1552.jpg
      altText: Imagen principal
      caption: Pie de foto de la imagen
      elementId: ''
    colors: colors-c
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
  - type: ContactSection
    colors: colors-f
    backgroundSize: full
    title: "¿Tienes un proyecto interesante? Cuéntame más...💬"
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
          label: Correo electrónico
          hideLabel: true
          placeholder: Correo electrónico
          isRequired: true
          width: 1/2
          type: EmailFormControl
        - name: address
          label: Dirección
          hideLabel: true
          placeholder: Dirección
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: updatesConsent
          label: Quiero recibir actualizaciones
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
          - ml-0
          - mr-0
        padding:
          - pt-24
          - pb-24
          - pr-4
          - pl-4
        flexDirection: row
        textAlign: left
--- 