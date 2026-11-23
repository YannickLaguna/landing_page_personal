---
type: PageLayout
title: Contacto
metaTitle: "Contacto"
metaDescription: "Agenda una cita conmigo o escríbeme un email: economía, datos y finanzas cuantitativas."
colors: colors-f
sections:
  # Página de contacto (/es/contact): destino del enlace «Contacto» del pie en todas las páginas
  - type: CtaSection
    elementId: contacto
    title: "Hablemos 💬"
    text: >-
      ¿Tienes un proyecto, una pregunta o quieres conocerme? Agenda una cita de
      30 minutos o escríbeme un email y te respondo lo antes posible.
    colors: colors-f
    actions:
      - type: Button
        label: Agenda una cita
        url: 'https://cal.com/ylaguna'
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
      - type: Button
        label: Escríbeme
        url: 'mailto:ylaguna000@gmail.com'
        style: secondary
    styles:
      self:
        height: auto
        width: narrow
        padding:
          - pt-36
          - pb-48
          - pl-4
          - pr-4
        textAlign: center
        flexDirection: col
        alignItems: center
---
