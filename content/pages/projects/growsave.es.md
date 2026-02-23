---
type: ProjectLayout
title: GROWSAVE
date: '2025-01-01'
description: >-
  Servicio web de planificación financiera personal con optimización de
  portafolios integrada. Permite a los usuarios definir metas de ahorro,
  simular escenarios de inversión y recibir una asignación de activos óptima
  calculada mediante programación cuadrática.
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
url: 'https://finpy.onrender.com/'
tags:
  - Python
  - FastAPI
  - Optimización de portafolios
  - Finanzas personales
addTitleSuffix: true
metaDescription: >-
  GROWSAVE es una aplicación de planificación financiera personal con
  optimización de portafolios mediante programación cuadrática.
colors: colors-b
---

GROWSAVE nace de la necesidad de democratizar la gestión financiera inteligente. La mayoría de las herramientas de planificación financiera ofrecen proyecciones simples, pero pocas integran optimización matemática real para la asignación de activos.

## Problema que resuelve

Los usuarios definen sus metas de ahorro (emergencia, retiro, viaje, etc.) y el horizonte temporal para cada una. A partir de esos parámetros, el sistema calcula la asignación óptima de activos que maximiza el retorno esperado para un nivel de riesgo dado, usando **programación cuadrática** (modelo de Markowitz).

## Stack técnico

- **Backend**: Python + FastAPI
- **Optimización**: `cvxpy` con solver OSQP para la frontera eficiente
- **Despliegue**: Render (free tier)

## Lo que aprendí

Integrar un solver de optimización en un flujo web tiene sus retos: los tiempos de cómputo hay que gestionarlos con cuidado en instancias pequeñas, y la validación de los parámetros de entrada (matrices de covarianza semidefinidas positivas) requiere robustez extra.
