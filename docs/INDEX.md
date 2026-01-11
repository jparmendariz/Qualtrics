# Indice de Documentacion - RX Hub

Guia rapida para encontrar la documentacion que necesitas.

## Documentacion Principal

| Documento | Descripcion | Ubicacion |
|-----------|-------------|-----------|
| README | Vision general del proyecto | `/README.md` |
| Arquitectura | Diseno tecnico y estructura | `/docs/ARCHITECTURE.md` |
| Prompts de IA | Guia de prompts integrados | `/docs/guides/AI_PROMPTS.md` |

## Documentacion por Fase

| # | Fase | Documento | Contenido Principal |
|---|------|-----------|---------------------|
| 1 | Pre-Kick Off | `/docs/phases/01-pre-kickoff.md` | Dossier de contexto, investigacion de industria |
| 2 | Post-Kick Off | `/docs/phases/02-post-kickoff.md` | Mapeo de contactos, enriquecimiento de datos |
| 3 | Kick Off Meeting | `/docs/phases/03-kickoff-meeting.md` | Agenda, KO Deck, transcripcion |
| 4 | Briefing & Design | `/docs/phases/04-briefing-design.md` | Research Brief, Survey Flow, Master Questionnaire |
| 5 | Programming & QC | `/docs/phases/05-programming-qc.md` | Formato TXT, QC checklist, UAT |
| 6 | Launch & Monitoring | `/docs/phases/06-launch-monitoring.md` | Soft launch, OE coding, monitoreo |
| 7 | Analysis Plan | `/docs/phases/07-analysis-plan.md` | Data cuts, visualizaciones, estructura reporte |
| 8 | Analysis & Insights | `/docs/phases/08-analysis-insights.md` | Key findings, headlines, framework WSW |
| 9 | Report QC | `/docs/phases/09-report-qc.md` | Validacion cruzada, sign-offs |

## Agentes de Claude Code

Agentes especializados para navegacion y tareas especificas:

| Agente | Archivo | Uso |
|--------|---------|-----|
| RX Navigator | `/.claude/agents/rx-navigator.md` | Navegar estructura del proyecto |
| Survey Programmer | `/.claude/agents/survey-programmer.md` | Conversion a TXT y programacion |
| Insight Generator | `/.claude/agents/insight-generator.md` | Generar findings y headlines |

## Estructura de Codigo

### Aplicacion Next.js
```
src/
├── app/                    # Routes y pages
├── components/             # Componentes React
├── lib/                    # Logica de negocio
├── hooks/                  # Custom hooks
├── types/                  # TypeScript definitions
├── prompts/                # Prompts de IA
└── utils/                  # Utilidades
```

### Archivos Clave

| Archivo | Proposito |
|---------|-----------|
| `src/types/index.ts` | Definiciones TypeScript |
| `src/lib/utils.ts` | Funciones de utilidad |
| `src/prompts/shared/system-prompts.ts` | Personas y prompts base |
| `src/prompts/phase-5/txt-conversion.ts` | Prompt de conversion TXT |

## Recursos Externos (Carpeta Qualtrics Original)

Templates y documentos de referencia en la carpeta padre:

| Recurso | Ubicacion |
|---------|-----------|
| Research Brief Template | `../Brief Example/Research Brief - Template.docx` |
| KO Deck Template | `../Kick-Off Deck/KO Deck template.pptx` |
| Analysis Plan Template | `../Analysis Plan/Analysis Plan Template.docx` |
| QC Guide | `../QC Docs/RX Quality Control Guide.xlsx` |
| Survey Example | `../Survey Design Example/Survey (example).docx` |
| Programming Guide | `../Programming Automation - Gemini Rules/` |

## Quick Links por Tarea

### "Necesito crear un nuevo proyecto"
1. Leer `/docs/phases/01-pre-kickoff.md`
2. Usar agente `rx-navigator` para ubicar componentes

### "Necesito convertir un survey a TXT"
1. Leer `/docs/phases/05-programming-qc.md`
2. Usar agente `survey-programmer`
3. Ver prompt en `/src/prompts/phase-5/txt-conversion.ts`

### "Necesito generar insights"
1. Leer `/docs/phases/08-analysis-insights.md`
2. Usar agente `insight-generator`
3. Aplicar framework What? So What? Now What?

### "Necesito hacer QC de un reporte"
1. Leer `/docs/phases/09-report-qc.md`
2. Usar checklist de QC
3. Documentar issues en QC Report

## Contribucion

Para agregar documentacion:
1. Crear archivo `.md` en la carpeta correspondiente
2. Actualizar este indice
3. Seguir el formato de los documentos existentes

## Actualizaciones

Ultima actualizacion: Enero 2025

---

*Este indice se actualiza conforme se agrega nueva documentacion al proyecto.*
