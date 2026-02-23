---
type: ProjectLayout
title: GROWSAVE
date: '2025-01-01'
description: >-
  Personal financial planning web service with integrated portfolio optimization. It allows users to set savings goals,
  simulate investment scenarios, and receive an optimal asset allocation calculated using quadratic programming.
featuredImage:
  type: ImageBlock
  url: /images/growsave-thumb.jpg
  altText: Captura de pantalla de GROWSAVE
  caption: ''
  elementId: ''
media:
  type: ImageBlock
  url: /images/growsave-thumb.jpg
  altText: Dashboard de GROWSAVE
  caption: ''
  elementId: ''
url: https://finpy.onrender.com/
tags:
  - Python
  - FastAPI
  - Optimización de portafolios
  - Finanzas personales
addTitleSuffix: true
metaDescription: >-
  GROWSAVE es una aplicación de planificación financiera personal con optimización de portafolios mediante programación
  cuadrática.
colors: colors-b
---
GROWSAVE was born out of the need to democratize smart financial management. Most financial planning tools offer simple projections, but few integrate real mathematical optimization for asset allocation. ## Problem it solves Users define their savings goals (emergency, retirement, travel, etc.) and the time horizon for each one. Based on these parameters, the system calculates the optimal asset allocation that maximizes the expected return for a given level of risk, using **quadratic programming** (Markowitz model). ## Technical stack - **Backend**: Python + FastAPI - **Optimization**: `cvxpy` with OSQP solver for the efficient frontier
- **Deployment**: Render (free tier) ## What I learned Integrating an optimization solver into a web flow has its challenges: computation times must be carefully managed in small instances, and the validation of input parameters (positive semidefinite covariance matrices) requires extra robustness.
