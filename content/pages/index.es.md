---
type: PageLayout
title: Inicio
colors: colors-b
sections:
  - type: HeroSection
    title: Soy desarrollador, artista digital, consultor y un montón de otros títulos impresionantes y palabras de moda.
    subtitle: ''
    actions:
      - type: Button
        label: Póngase en contacto
        altText: ''
        url: https://cal.com/ylaguna
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
    title: Areas of Interest
    subtitle: Eche un vistazo a algunas de las cosas en las que me encanta trabajar.
    interests:
      - icon: cloud
        title: Computación en nube
        description: >-
          Mantengo servidores para el almacenamiento de bases de datos, la formación de modelos y la implantación de
          modelos.
      - icon: chat
        title: PNL
        description: >-
          I have worked with researchers to apply NLP techniques to make sense of the motivations behind human
          interactions.
      - icon: brain
        title: Machine Learning
        description: >-
          Machine learning is more than an API call to scikit-learn. I love the math and theory as well as the
          implementation.
      - icon: layers
        title: Parallel Computing
        description: I regularly extract data from Hadoop databases using the HIVE framework.
      - icon: upload
        title: Model Deployment
        description: I implement machine learning models in real world production systems using REST APIs.
      - icon: bar-chart
        title: Data Analytics
        description: I love telling a story. Making a beautiful and compelling presentation is one of my favorite skills.
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
      - content/pages/projects/project-two.md
      - content/pages/projects/project-three.md
      - content/pages/projects/project-one.md
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
    subtitle: Projects
  - type: FeaturedPostsSection
    elementId: ''
    colors: colors-f
    variant: variant-d
    subtitle: Featured Posts
    showFeaturedImage: false
    actions:
      - type: Link
        label: See all posts
        url: /blog
    posts:
      - content/pages/blog/post-six.md
      - content/pages/blog/post-four.md
      - content/pages/blog/post-three.md
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
    title: ''
  - type: ContactSection
    colors: colors-f
    backgroundSize: full
    title: Got an interesting project? Tell me more...💬
    form:
      type: FormBlock
      elementId: sign-up-form
      fields:
        - name: firstName
          label: First Name
          hideLabel: true
          placeholder: First Name
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: lastName
          label: Last Name
          hideLabel: true
          placeholder: Last Name
          isRequired: false
          width: 1/2
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Email
          isRequired: true
          width: 1/2
          type: EmailFormControl
        - name: address
          label: Address
          hideLabel: true
          placeholder: Address
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: updatesConsent
          label: Sign me up to recieve updates
          isRequired: false
          width: full
          type: CheckboxFormControl
      submitLabel: Submit 🚀
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
