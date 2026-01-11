# Fase 4: Briefing & Survey Design

## Objetivo
Consolidar toda la informacion en un Research Brief estructurado y generar el primer borrador de la encuesta.

## Trigger
- Kick Off Meeting completado y documentado (Fase 3)

## Tiempo Estimado
- Brief: 2-3 dias habiles
- Survey Design: 2 semanas + 1 semana review cliente

## Que se Automatiza

### 1. Consolidacion del Brief
La IA recopila automaticamente de fases anteriores:
- Contexto del cliente (Dossier)
- Stakeholders y contactos
- Objetivos del KO meeting
- Decisiones y constraints

### 2. Generacion de Survey Flow
- Estructura de bloques de contenido
- Orden logico de secciones
- Puntos de bifurcacion (branching)

### 3. Drafting de Preguntas
- Primer borrador basado en objetivos
- Best practices de survey design
- Prevencion de sesgos integrada

## Entregables

### 1. Research Brief (16 secciones)

```markdown
# Research Brief

## Informacion del Proyecto
- **Client**: [Nombre]
- **Opp**: [Salesforce ID]
- **Project Name**: [Nombre del proyecto]
- **Kick-off Date**: [Fecha]
- **Qualtrics Account**: [Cuenta]

## Services Checklist
- [ ] Survey Review
- [ ] Sample/Panel
- [ ] Crosstabs
- [ ] Survey Design
- [ ] MaxDiff
- [ ] Weighting
- [ ] Conjoint
- [ ] Translations
- [ ] Open-End Coding
- [ ] Clustering
- [ ] Reporting
- [ ] Dashboard

## Background
[Contexto historico, investigacion anterior, situacion actual]

## Research Objectives / Key Questions
1. [Objetivo principal]
2. [Objetivo secundario]
3. [...]

## Assumptions / Hypotheses
- [Hipotesis 1]
- [Hipotesis 2]

## Target Details
- **Total N**: [Numero]
- **Screening Criteria**: [Lista]
- **Quotas**: [Distribuciones]
- **Sub-groups for Analysis**: [Segmentos]

## Business Impact
[Como se usaran los resultados, decisiones que se tomaran]

## Project Timeline
| Milestone | Date | Responsible |
|-----------|------|-------------|
| Brief Approval | [Fecha] | Client |
| Survey Design | [Fecha] | LA |
| Programming | [Fecha] | LA |
| Soft Launch | [Fecha] | RM |
| Full Launch | [Fecha] | RM |
| Analysis | [Fecha] | LA |
| Final Report | [Fecha] | RM |

## Project Team
| Role | Name | Email |
|------|------|-------|
| Research Manager | [Nombre] | [Email] |
| Lead Analyst | [Nombre] | [Email] |
| Project Manager | [Nombre] | [Email] |
| Client Lead | [Nombre] | [Email] |
```

### 2. Survey Flow Document

```markdown
# Survey Flow: [Proyecto]

## Overview
- **Duracion estimada**: [X] minutos
- **Audiencias**: [Lista]
- **Total de preguntas**: [X]

## Flow Structure

### Block 1: Screeners
- Verificacion de elegibilidad
- Criterios de terminacion
- Quotas iniciales

### Block 2: Demographics
- Edad, genero, ubicacion
- Ingresos, educacion (si aplica)
- Rol/cargo (B2B)

### Block 3: [Topic Principal 1]
- [Subtema 1.1]
- [Subtema 1.2]

### Block 4: [Topic Principal 2]
- [Subtema 2.1]
- [Subtema 2.2]

[...]

### Block N: Closing
- Preguntas finales
- Agradecimiento
- Codigo de finalizacion

## Branching Logic
- Si [condicion] → ir a [block]
- Si [condicion] → terminar

## Randomizaciones
- [Block X]: Randomizar orden de items
- [Question Y]: Randomizar opciones
```

### 3. Master Questionnaire (SOT)

El documento Word que sirve como Source of Truth, incluyendo:
- Survey Outline completo
- Lista de screeners con logica
- Lista de quotas
- Instrucciones de logic por pregunta
- Directivas de randomizacion
- Variables de Embedded Data
- Question types especificos
- Labels unicos (<20 caracteres)

## Workflow en RX Hub

```
BRIEFING
1. Sistema carga datos de fases anteriores
   └── Pre-popula el Brief template

2. IA consolida informacion automaticamente
   └── Usuario revisa y completa gaps

3. Usuario ajusta timeline y team
   └── Confirma con PM

4. Brief enviado a cliente para aprobacion
   └── Se trackean cambios

SURVEY DESIGN
5. Usuario selecciona metodologia
   └── Brand, CX, Segmentation, etc.

6. IA genera Survey Flow borrador
   └── Basado en objetivos del Brief

7. Usuario revisa y ajusta Flow
   └── Aprobacion interna

8. IA genera preguntas por bloque
   └── Metodo: block-by-block o completo

9. Usuario itera con IA
   └── Refina preguntas y opciones

10. Master Questionnaire finalizado
    └── Listo para programacion
```

## Proceso Colaborativo de Diseno

### Opcion A: Block-by-Block
1. IA presenta estructura de bloques
2. Cliente aprueba flujo general
3. IA drafta un bloque a la vez
4. Revision iterativa por bloque
5. Ensamble final

### Opcion B: Draft Completo
1. IA presenta estructura de bloques
2. Cliente aprueba flujo general
3. IA genera draft completo
4. Revision holistica
5. Iteraciones sobre el total

## Prompt de IA: Survey Design

```markdown
Eres un Senior Research Consultant especializado en diseno de encuestas.

**Proyecto**: {{project_name}}
**Cliente**: {{client_name}}
**Metodologia**: {{methodology}}

**Objetivos de Research**:
{{objectives}}

**Target Audience**:
{{target_description}}

**Constraints**:
- Duracion maxima: {{max_duration}} minutos
- Numero maximo de preguntas: {{max_questions}}

Disena una encuesta siguiendo estas best practices:

1. **Flujo logico**: De general a especifico (funnel approach)
2. **Prevencion de sesgos**:
   - Randomizar opciones cuando sea posible
   - Evitar preguntas leading
   - Colocar temas sensibles al final
3. **Claridad**:
   - Preguntas simples y directas
   - Evitar double-barreled questions
   - No usar jerga tecnica

Para cada pregunta incluye:
- Question ID (max 15 caracteres)
- Texto de la pregunta
- Tipo (MC, Matrix, TextEntry, etc.)
- Opciones de respuesta
- Logic (si aplica)

Formato de salida: Documento estructurado listo para programacion.
```

## Best Practices de Survey Design

### Estructura General
1. Screeners primero (verificar elegibilidad)
2. Preguntas faciles para warm-up
3. Temas principales en el medio
4. Preguntas sensibles/demograficas al final

### Tipos de Pregunta por Objetivo

| Objetivo | Tipo Recomendado |
|----------|------------------|
| Awareness | MC Single/Multi |
| Satisfaction | Scale (1-5, 1-7) |
| Preference | Rank Order, MaxDiff |
| Behavior | MC Multi, Frequency scales |
| Drivers | Matrix, Conjoint |
| Open feedback | Text Entry |

### Errores a Evitar

- **Double-barreled**: "¿Que tan satisfecho esta con el precio y la calidad?"
- **Leading**: "¿No cree que nuestro servicio es excelente?"
- **Absolutes**: "¿Siempre/Nunca...?"
- **Jargon**: Terminos tecnicos sin explicar
- **Overlapping ranges**: 1-5, 5-10, 10-15

## Checklist de Validacion

### Brief
- [ ] Todos los campos requeridos completos
- [ ] Objetivos claros y medibles
- [ ] Target audience bien definido
- [ ] Timeline realista
- [ ] Team asignado

### Survey Flow
- [ ] Flujo logico de temas
- [ ] Screeners cubren todos los criterios
- [ ] Branching logic documentado
- [ ] Duracion estimada realista

### Master Questionnaire
- [ ] Todas las preguntas tienen ID unico
- [ ] Question types especificados
- [ ] Logic documentada
- [ ] Randomizaciones indicadas
- [ ] Embedded Data definido

## Tips para el Research Manager

1. **El Brief es el contrato**: Todo lo que no este en el Brief puede generar scope creep.

2. **Involucrar al cliente temprano**: Mejor iterar en design que en programacion.

3. **Pensar en el analisis**: ¿Podre responder las preguntas con estos datos?

4. **Ser conservador con duracion**: Encuestas largas = datos de baja calidad.

5. **Documentar TODO**: El Master Questionnaire es la fuente de verdad.

## Siguiente Fase
Con el Master Questionnaire aprobado, avanzar a **Fase 5: Programming & QC**.
