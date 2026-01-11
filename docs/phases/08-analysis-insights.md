# Fase 8: Analysis & Insights Generation

## Objetivo
Procesar los datos, generar insights accionables y crear el reporte final con narrativa coherente.

## Trigger
- Fieldwork completado (Fase 6)
- Analysis Plan aprobado (Fase 7)

## Tiempo Estimado
- Analisis: 2 semanas
- Reporte: 2 semanas (en paralelo)

## Que se Automatiza

### 1. Generacion de Callouts
La IA identifica automaticamente:
- Datos mas relevantes por slide
- Diferencias significativas entre segmentos
- Tendencias notables

### 2. Headlines de Slides
- Titulos impactantes basados en datos
- Framework "What? So What? Now What?"
- Recomendaciones accionables

### 3. Key Findings
- 5-8 insights principales
- Priorizados por impacto de negocio
- Con evidencia de datos

## Entregables

### 1. Key Findings Document

```markdown
# Key Findings: [Proyecto]

## Framework: What? So What? Now What?

### Finding 1: [Headline]
**What?** [Dato/observacion]
**So What?** [Implicacion para el negocio]
**Now What?** [Recomendacion accionable]

**Supporting Data**:
- [Stat 1]
- [Stat 2]
- [Slide reference]

---

### Finding 2: [Headline]
[...]

---

## Priority Matrix

| Finding | Business Impact | Urgency | Priority |
|---------|-----------------|---------|----------|
| Finding 1 | High | High | 1 |
| Finding 2 | High | Medium | 2 |
| Finding 3 | Medium | High | 3 |
```

### 2. Slide Headlines

```markdown
# Headlines por Slide

## Section: Brand Awareness

### Slide 5: Unaided Awareness
**Headline**: "Brand X leads unaided awareness at 45%, 2x higher than nearest competitor"
**Callout**: "45% mention Brand X first when thinking of category"
**Implication**: Strong top-of-mind presence provides competitive advantage

### Slide 6: Aided Awareness
**Headline**: "Near-universal aided awareness (92%) but consideration gap exists"
**Callout**: "Only 34% would consider purchasing despite high awareness"
**Implication**: Opportunity to convert awareness to consideration
```

### 3. Report Draft
Presentacion PPT con:
- Executive Summary
- Key Findings
- Secciones detalladas
- Recommendations
- Appendix

## Workflow en RX Hub

```
DATA PROCESSING
1. Exportar datos de Qualtrics
   └── Limpiar y preparar dataset

2. Generar crosstabs
   └── Segun banners del Analysis Plan

3. IA analiza crosstabs
   └── Identifica patrones y anomalias

INSIGHT GENERATION
4. IA genera callouts por pregunta
   └── Datos mas relevantes

5. IA sugiere headlines por slide
   └── Aplicando framework WSW?

6. Usuario revisa y refina
   └── Ajusta narrativa y prioridades

REPORT CREATION
7. Poblar template con datos
   └── Charts y tablas

8. Agregar headlines y callouts
   └── Narrativa por slide

9. Escribir Executive Summary
   └── Condensar key findings

10. Internal QC
    └── Revisar antes de cliente
```

## Framework: What? So What? Now What?

### What? (El Dato)
- Descripcion objetiva de lo que muestran los datos
- Sin interpretacion aun
- Especifico y cuantificable

**Ejemplo**: "El 65% de los usuarios reporta usar la app diariamente"

### So What? (La Implicacion)
- Por que importa este dato
- Conexion con objetivos de negocio
- Comparacion con benchmarks o expectativas

**Ejemplo**: "Esto supera el benchmark de industria (45%), indicando alta engagement"

### Now What? (La Accion)
- Recomendacion especifica
- Accionable y realista
- Vinculada al insight

**Ejemplo**: "Capitalizar el engagement con programa de loyalty para aumentar LTV"

## Prompt de IA: Headline Generation

```markdown
Eres un Senior Research Consultant creando headlines para un reporte.

**Contexto del proyecto**:
{{project_context}}

**Datos de la slide**:
{{slide_data}}

**Pregunta original**:
{{question_text}}

**Data cuts disponibles**:
{{data_cuts}}

Genera:

1. **Headline** (max 15 palabras)
   - Debe comunicar el insight principal
   - Evitar ser solo descriptivo ("Results of Q1")
   - Incluir el dato clave

2. **Callout** (1-2 oraciones)
   - Stat mas importante
   - Diferencia significativa si existe

3. **So What?** (1 oracion)
   - Implicacion para el negocio

4. **Recommendation** (si aplica)
   - Accion sugerida basada en el dato

Tono: Profesional pero accesible.
Evitar: Jerga excesiva, conclusiones sin soporte.
```

## Prompt de IA: Key Findings

```markdown
Analiza los siguientes datos de research y genera Key Findings.

**Proyecto**: {{project_name}}
**Objetivos**: {{objectives}}
**Datos**: {{data_summary}}

Genera 5-8 Key Findings siguiendo el framework What? So What? Now What?

Criterios de priorizacion:
1. Impacto en decisiones de negocio
2. Magnitud del hallazgo
3. Novedad/sorpresa vs expectativas
4. Accionabilidad

Para cada finding incluye:
- Headline impactante
- What? (el dato)
- So What? (la implicacion)
- Now What? (la recomendacion)
- Datos de soporte (2-3 stats)
- Nivel de confianza (basado en base size y significancia)

Formato: Lista priorizada con nivel de detalle consistente.
```

## Estructura del Reporte Final

### 1. Cover Slide
- Titulo del proyecto
- Cliente
- Fecha
- Confidencialidad

### 2. Table of Contents
- Secciones con numeros de slide
- Hyperlinks (si aplica)

### 3. Executive Summary (2-3 slides)
- Key Findings (bullets)
- Strategic Recommendations
- "If you only read 3 slides..."

### 4. Methodology (1-2 slides)
- Sample size y composicion
- Fieldwork dates
- Methodology description
- Weighting (si aplica)

### 5. Main Sections (variable)
- Organizadas por tema/objetivo
- 1 insight principal por slide
- Data visualizations claras
- Callouts destacados

### 6. Recommendations (1-2 slides)
- Accionables
- Priorizadas
- Vinculadas a findings

### 7. Appendix
- Demographics completos
- Data tables detalladas
- Metodologia adicional
- Limitaciones

## Best Practices de Reporting

### Visualizaciones
- Un chart principal por slide
- Colores consistentes
- Labels legibles
- Fuente en cada chart

### Headlines
- Insight, no descripcion
- Max 15 palabras
- Sin jerga

### Callouts
- Datos mas importantes
- Destacados visualmente
- Con context (vs benchmark, vs segment)

### Notes
- Base size en cada slide
- Question text en speaker notes
- Stat testing notation

## Checklist de Validacion

### Data Accuracy
- [ ] Todos los datos coinciden con crosstabs
- [ ] Base sizes correctos
- [ ] Stat testing correcto
- [ ] Calculos verificados (means, indexes)

### Narrative
- [ ] Headlines son insights, no descripciones
- [ ] Flujo logico entre slides
- [ ] Recommendations son accionables
- [ ] Executive summary cubre key points

### Format
- [ ] Consistencia visual
- [ ] Sin errores de ortografia
- [ ] Charts legibles
- [ ] Branding correcto

## Tips para el Research Manager

1. **Empezar por los findings**: No por los datos.

2. **Escribir para el CEO**: ¿Entenderia el mensaje en 30 segundos?

3. **Cada slide debe "stand alone"**: Si alguien ve solo esa slide, ¿entiende el punto?

4. **Menos slides > mas slides**: Cada slide debe ganarse su lugar.

5. **Contar una historia**: No es un data dump.

## Errores Comunes a Evitar

- Headlines descriptivos ("Results of Q5")
- Demasiados charts por slide
- Ignorar base sizes bajos
- No vincular findings a objetivos
- Recomendaciones genericas ("Improve marketing")

## Siguiente Fase
Con el draft del reporte listo, proceder a **Fase 9: Report QC**.
