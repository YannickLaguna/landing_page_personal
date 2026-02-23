---
type: PageLayout
title: Home
colors: colors-b
sections:
  - type: HeroSection
    title: Yannick Laguna
    subtitle: Passionate about finance, analysis, and problem solving
    actions:
      - type: Button
        label: Get in touch
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
      caption: Caption
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
    title: Areas of interest
    subtitle: Some of the things I love to work on.
    interests:
      - icon: optimizacion
        title: Optimization
        description: >-
          I reduce costs and maximize results by identifying operational inefficiencies. I implement mathematical models
          and algorithms that optimize resource use and increase your organization's profitability.
      - icon: dashboard
        title: Business Intelligence
        description: >-
          I transform complex data into actionable insights that drive strategic decisions. From interactive dashboards
          to predictive analytics, I help organizations uncover hidden patterns and growth opportunities in their data.
      - icon: brain
        title: Machine Learning
        description: >-
          I develop customized ML solutions that go beyond basic tools. I love mathematics and theory as much as
          implementation.
      - icon: cog
        title: Automation
        description: >-
          I eliminate repetitive tasks and optimize workflows. I free up your team's valuable time so you can focus on
          what really matters.
      - icon: chart
        title: Data analysis
        description: >-
          I turn complex data into stories that drive action. I create presentations and reports that clearly
          communicate insights to stakeholders at all levels.
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
    title: Projects
  - type: NotebooksSection
    title: 📓 Jupyter Notebooks
    subtitle: Data analysis, machine learning, and optimization
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
        label: See all posts
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
    title: Publications
---
