# RX Hub - Research Experience Hub

Plataforma centralizada para Research Managers de Qualtrics que automatiza y estandariza el proceso end-to-end de investigacion de clientes.

## Contexto del Proyecto

A partir de enero 2025, los roles de **Research Analyst**, **Project Manager** y **Sales** se consolidaron en un unico puesto: **Research Manager (RM)**. Esta herramienta nace para:

- Reducir la curva de aprendizaje de los nuevos RM
- Automatizar tareas repetitivas en las 9 fases del proceso
- Estandarizar entregables y flujos de trabajo
- Integrar los Gems de IA (Gemini) directamente en la plataforma
- Minimizar errores y dependencia de especializacion previa

## Fases del Proceso RX

| Fase | Nombre | Automatizacion |
|------|--------|----------------|
| 1 | Pre-Kick Off | Dossier de contexto automatico |
| 2 | Post-Kick Off | Mapeo de contactos y enriquecimiento |
| 3 | Kick Off Meeting | Agenda, presentacion, transcripcion |
| 4 | Briefing & Survey Design | Brief consolidado, borrador de encuesta |
| 5 | Programming & QC | Codigo TXT automatico, auditoria |
| 6 | Launch & Monitoring | Soft launch, OE coding |
| 7 | Analysis Plan | Plan automatico, data cuts sugeridos |
| 8 | Analysis & Insights | Callouts, headlines, key findings |
| 9 | Report QC | Validacion cruzada automatica |

## Tech Stack

- **Framework**: Next.js 14+ con App Router
- **UI**: React + Tailwind CSS + shadcn/ui
- **Estado**: Zustand
- **IA**: Integracion con Gemini API (prompts internos)
- **Base de datos**: SQLite local (fase 1) / PostgreSQL (fase 2)
- **Qualtrics**: Exportacion TXT manual (fase 1) / API directa (fase 2)

## Estructura del Proyecto

```
rx-hub/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (dashboard)/        # Layout del dashboard
│   │   ├── projects/           # Gestion de proyectos
│   │   ├── phases/             # Fases del proceso
│   │   └── api/                # API routes
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes base (shadcn)
│   │   ├── phases/             # Componentes por fase
│   │   └── shared/             # Componentes compartidos
│   ├── lib/                    # Logica de negocio
│   │   ├── qualtrics/          # Integracion Qualtrics
│   │   ├── gemini/             # Integracion Gemini
│   │   └── db/                 # Base de datos
│   ├── hooks/                  # Custom hooks
│   ├── types/                  # TypeScript types
│   ├── prompts/                # Prompts de IA por fase
│   └── utils/                  # Utilidades
├── docs/                       # Documentacion
│   ├── phases/                 # Guias por fase
│   ├── guides/                 # Guias generales
│   └── templates/              # Templates de referencia
├── public/                     # Assets estaticos
└── .claude/                    # Agentes de Claude Code
    └── agents/                 # Agentes especializados
```

## Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Agregar GEMINI_API_KEY

# Iniciar en desarrollo
npm run dev

# Abrir http://localhost:3000
```

## Funcionalidades Principales

### 1. Dashboard de Proyectos
- Vista de todos los proyectos activos
- Estado por fase
- Timeline y deadlines
- Acceso rapido a documentos

### 2. Wizard por Fase
Cada fase tiene un wizard guiado que:
- Explica que se debe hacer
- Proporciona templates pre-llenados
- Integra IA para generacion automatica
- Valida entregables antes de avanzar

### 3. Generadores con IA
- **Dossier de Contexto**: Investiga cliente automaticamente
- **Survey Designer**: Genera borradores de encuestas
- **Programming Builder**: Convierte a formato TXT Qualtrics
- **Analysis Planner**: Sugiere estructura de analisis
- **Insight Generator**: Crea headlines y callouts

### 4. Templates Integrados
- Research Brief
- KO Deck
- Master Questionnaire
- Analysis Plan
- QC Checklist

### 5. Quality Control
- Checklists interactivos por fase
- Validaciones automaticas
- Log de cambios (UAT)

## Roadmap

### Fase 1 (MVP)
- [ ] Dashboard basico de proyectos
- [ ] Wizard de cada fase con guias
- [ ] Integracion de prompts de Gemini
- [ ] Generador de archivos TXT para Qualtrics
- [ ] Templates editables

### Fase 2 (Automatizacion)
- [ ] API de Qualtrics para crear surveys directamente
- [ ] Transcripcion automatica de meetings
- [ ] Enriquecimiento de datos de contactos
- [ ] Base de datos persistente

### Fase 3 (Inteligencia)
- [ ] Sugerencias basadas en proyectos anteriores
- [ ] Prediccion de timelines
- [ ] Alertas proactivas
- [ ] Dashboard de metricas

## Documentacion

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Guia de Fases](./docs/phases/)
- [Integracion Qualtrics](./docs/guides/QUALTRICS_INTEGRATION.md)
- [Prompts de IA](./docs/guides/AI_PROMPTS.md)

## Equipo

Esta herramienta fue disenada para el equipo de Research de Qualtrics, con el objetivo de empoderar a los Research Managers en su nuevo rol consolidado.

---

Desarrollado con Claude Code
