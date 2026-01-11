# Fase 7: Analysis Plan

## Objetivo
Crear un plan estructurado de analisis que define como se procesaran los datos y se estructurara el reporte final.

## Trigger
- Soft launch aprobado o fieldwork iniciado (Fase 6)

## Tiempo Estimado
- 3-5 dias habiles

## Que se Automatiza

### 1. Estructura del Plan
La IA genera automaticamente:
- Outline de secciones del reporte
- Data cuts recomendados
- Visualizaciones sugeridas por pregunta
- Estimacion de slides

### 2. Mapping de Preguntas
- Conexion entre business questions y survey questions
- Identificacion de gaps potenciales
- Priorization de analisis

## Entregables

### Analysis Plan Document

```markdown
# Analysis Plan: [Proyecto]

## 1. Project Information
- **Client**: [Nombre]
- **Opp**: [ID]
- **Fieldwork dates**: [Inicio] - [Fin]
- **Final n**: [Numero]

## 2. Research Objectives Recap
1. [Objetivo 1]
2. [Objetivo 2]
3. [Objetivo 3]

## 3. Advanced Analytics Overview
- [ ] Weighting: [Descripcion si aplica]
- [ ] Segmentation: [Descripcion si aplica]
- [ ] Key driver analysis: [Descripcion si aplica]
- [ ] MaxDiff utility scores: [Descripcion si aplica]

## 4. Data Cuts (Banners)

### Banner 1: Demographics
| Point | Definition |
|-------|------------|
| Total | All respondents |
| Male | Gender = Male |
| Female | Gender = Female |
| Gen Z | Age 18-24 |
| Millennials | Age 25-44 |
| Gen X+ | Age 45+ |

### Banner 2: [Segment]
| Point | Definition |
|-------|------------|
| [Segment A] | [Definition] |
| [Segment B] | [Definition] |

## 5. Report Flow

### Section 1: Executive Summary
- Key findings (5-7 bullets)
- Strategic recommendations
- Estimated slides: 2-3

### Section 2: [Topic 1]
**Business Question**: [Pregunta de negocio]
**Survey Questions**: [Q1, Q2, Q3]
**Data Cuts**: [Cuales aplicar]
**Visualizations**:
- Q1: Horizontal bar chart
- Q2: Stacked bar chart
- Q3: Line chart (if trending)
**Estimated slides**: 4-6

### Section 3: [Topic 2]
[...]

### Section N: Appendix
- Methodology
- Demographics
- Full data tables
- Estimated slides: 5-10

## 6. Detailed Question Mapping

| Business Question | Survey Q | Analysis Type | Viz Type | Slide Est |
|-------------------|----------|---------------|----------|-----------|
| Brand awareness | Q1, Q2 | Descriptive | Bar | 2 |
| Purchase drivers | Q5 | Driver analysis | Correlation | 3 |
| Satisfaction | Q8 | Descriptive + cuts | Stacked bar | 2 |

## 7. Report Specifications
- **Total slides estimate**: [X]
- **Stat testing**: 95% confidence
- **Min base size for reporting**: n=50
- **Caution base size**: n=50-75
- **Decimal places**: 0 for %, 2 for means

## 8. Timeline

| Milestone | Date | Owner |
|-----------|------|-------|
| Analysis Plan approval | [Fecha] | Client |
| Crosstabs delivery | [Fecha] | LA |
| Draft report | [Fecha] | LA |
| Internal review | [Fecha] | RM |
| Client review | [Fecha] | Client |
| Final report | [Fecha] | RM |
```

## Workflow en RX Hub

```
1. Sistema carga Research Brief y Survey
   └── Extrae objetivos y preguntas

2. IA genera Analysis Plan borrador
   └── Mapea objetivos a preguntas

3. Usuario revisa y ajusta
   ├── Agrega/quita data cuts
   ├── Ajusta visualizaciones
   └── Confirma estimaciones

4. Usuario define banners para crosstabs
   └── Especifica definiciones exactas

5. Plan enviado a cliente
   └── Reunir feedback

6. Plan aprobado
   └── Avanza a Fase 8
```

## Prompt de IA: Analysis Plan

```markdown
Eres un Senior Research Analyst creando un Analysis Plan.

**Proyecto**: {{project_name}}
**Cliente**: {{client_name}}

**Research Objectives**:
{{objectives}}

**Survey Questions** (resumen):
{{survey_summary}}

**Target audience**:
{{audience_description}}

**Max slides**: {{max_slides}}

Crea un Analysis Plan que:

1. **Estructura del reporte**
   - Secciones logicas que respondan los objetivos
   - Flujo narrativo coherente
   - Executive summary al inicio

2. **Data cuts recomendados**
   - Demograficos relevantes
   - Segmentos de interes
   - Justificacion de cada corte

3. **Visualizaciones por pregunta**
   - Tipo de grafica mas efectiva
   - Justificacion de la eleccion

4. **Mapping objetivo → pregunta**
   - Cada objetivo debe tener preguntas que lo respondan
   - Identificar gaps si los hay

Formato: Documento estructurado con tablas y listas.
```

## Data Cuts Comunes

### Demograficos
- Age groups
- Gender
- Region/Geography
- Income brackets
- Education level

### Comportamiento
- Frequency of purchase
- Category buyers vs non-buyers
- Brand users vs non-users
- Channel preference

### Actitudinales
- Satisfaction levels (Top 2 Box, Bottom 2 Box)
- NPS groups (Promoters, Passives, Detractors)
- Segments (from segmentation questions)

## Tipos de Visualizacion por Pregunta

| Tipo de Pregunta | Visualizacion Recomendada |
|------------------|---------------------------|
| MC Single | Horizontal bar chart |
| MC Multi | Horizontal bar chart (sorted) |
| Scale/Rating | Stacked bar or mean with error |
| Matrix | Heat map or grouped bar |
| Ranking | Horizontal bar (by avg rank) |
| Open-end | Word cloud or theme chart |
| MaxDiff | Utility score bar chart |
| NPS | Gauge + distribution bar |

## Reglas de Reporting

### Base Sizes
- **n < 50**: No incluir en slides (solo appendix)
- **n = 50-75**: Incluir con nota "Lower base size, use directionally"
- **n > 75**: Incluir sin restriccion

### Stat Testing
- Default: 95% confidence level
- Notacion: Letras (a, b, c) o arrows
- Incluir en notas de slide

### Decimals
- Porcentajes: 0 decimales
- Means: 1-2 decimales
- Indices: 0 decimales

## Checklist de Validacion

### Structure
- [ ] Todos los objetivos tienen preguntas mapeadas
- [ ] Flujo del reporte es logico
- [ ] Estimacion de slides es realista
- [ ] Data cuts son relevantes y factibles

### Crosstabs
- [ ] Banners definidos con claridad
- [ ] Definiciones exactas para cada punto
- [ ] Base sizes viables
- [ ] Stat testing especificado

### Alignment
- [ ] Cliente ha revisado el plan
- [ ] Expectativas de slides alineadas
- [ ] Timeline acordado
- [ ] Formato de entrega confirmado (PPT, PDF, Dashboard)

## Tips para el Research Manager

1. **Pensar en la audiencia del reporte**: ¿Quien lo va a leer? C-level vs Analysts.

2. **Menos es mas**: Mejor 30 slides impactantes que 80 con ruido.

3. **Priorizar insights sobre datos**: El reporte no es un data dump.

4. **Alinear con cliente temprano**: Evitar sorpresas en el reporte final.

5. **Considerar el tiempo de analisis**: Cada data cut extra = mas trabajo.

## Errores Comunes a Evitar

- Crear plan sin revisar base sizes reales
- Prometer analisis avanzados sin datos suficientes
- No considerar el tiempo disponible para analisis
- Olvidar secciones estandar (methodology, demographics)
- No especificar formato de entrega

## Siguiente Fase
Con el Analysis Plan aprobado, comenzar **Fase 8: Analysis & Insights**.
