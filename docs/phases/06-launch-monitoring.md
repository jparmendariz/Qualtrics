# Fase 6: Launch & Data Monitoring

## Objetivo
Ejecutar soft launch, validar calidad de datos, y monitorear el fieldwork hasta completar la muestra.

## Trigger
- Survey aprobado en UAT (Fase 5)
- Links de distribucion listos

## Tiempo Estimado
- Soft launch: 2-3 dias
- Full launch: 2 semanas (variable segun n)

## Que se Automatiza

### 1. Analisis de Soft Launch
La IA revisa automaticamente:
- Distribucion de respuestas
- Tiempos de completion
- Patrones anomalos
- Tasa de drop-off por pregunta

### 2. Codificacion de Open-Ends (OE)
- Categorizacion automatica de respuestas abiertas
- Identificacion de temas emergentes
- Agrupacion de menciones de marcas

### 3. Monitoreo de Calidad
- Alertas de speeders
- Deteccion de straightliners
- Quality score tracking

## Entregables

### 1. Soft Launch Report

```markdown
# Soft Launch Analysis: [Proyecto]
**Fecha**: [DD/MM/YYYY]
**n completadas**: [X] de [Target]

## Resumen Ejecutivo
- Status: Go / No-Go / Needs Review
- Issues criticos: [Lista]
- Recomendaciones: [Lista]

## Metricas de Calidad

| Metrica | Valor | Benchmark | Status |
|---------|-------|-----------|--------|
| Median LOI | X min | Y min | OK/Flag |
| Completion rate | X% | >80% | OK/Flag |
| Speeders (<1/3 median) | X% | <5% | OK/Flag |
| Straightliners | X% | <3% | OK/Flag |

## Drop-off Analysis

| Question | Drop-off % | Cumulative | Flag |
|----------|------------|------------|------|
| S1_AGE | 2% | 2% | OK |
| Q5_LONG | 15% | 17% | Review |

## Distribucion de Respuestas

### Screeners
- S1_AGE: Distribucion balanceada
- S2_CATEGORY: [Observaciones]

### Preguntas Clave
- Q1_AWARENESS: [Observaciones]
- Q2_SATISFACTION: [Observaciones]

## Issues Identificados
1. [Issue 1] - Severidad: [Alta/Media/Baja]
2. [Issue 2] - Severidad: [Alta/Media/Baja]

## Recomendacion
[ ] Lanzar full field
[ ] Ajustar survey y re-soft launch
[ ] Pausar y revisar con cliente
```

### 2. OE Coding Schema

```markdown
# Open-End Coding: [Pregunta]

## Categorias Principales

| Code | Category | Definition | Examples |
|------|----------|------------|----------|
| 01 | Price | Mencion de precio/costo | "Too expensive", "Good value" |
| 02 | Quality | Calidad del producto | "High quality", "Broke quickly" |
| 03 | Service | Servicio al cliente | "Helpful staff", "Long wait" |

## Subcategorias

### 01 - Price
- 01a: Positive price mention
- 01b: Negative price mention
- 01c: Price comparison

## Reglas de Codificacion
- Cada respuesta puede tener multiples codigos
- Codigo 99 = Not applicable / Gibberish
- Codigo 98 = Other (no categorizable)
```

## Workflow en RX Hub

```
SOFT LAUNCH
1. RM aprueba inicio de soft launch
   └── Activa distribucion (n limitado)

2. Sistema monitorea en tiempo real
   └── Dashboard de metricas

3. Al alcanzar n minimo (ej: 50)
   └── IA genera Soft Launch Report

4. RM revisa y decide
   ├── Go → Full launch
   ├── Adjust → Modificar survey
   └── Stop → Escalar a cliente

FULL LAUNCH
5. Activar distribucion completa
   └── Monitoreo continuo

6. Sistema alerta anomalias
   └── Speeders, straightliners, quotas

7. OE Coding en paralelo
   └── IA categoriza respuestas

8. Al completar muestra
   └── Cerrar field, avanzar a analisis
```

## Metricas de Calidad

### Length of Interview (LOI)
- **Target**: Segun duracion estimada del survey
- **Flag**: Speeders < 1/3 del median
- **Flag**: Turtles > 3x del median

### Completion Rate
- **Target**: >80%
- **Flag**: <70% indica problema de survey

### Quality Score (Qualtrics)
- **Good**: >70
- **Review**: 50-70
- **Bad**: <50

### Straightlining
- Respuestas identicas en matrices
- **Threshold**: >80% mismo patron = flag

### Duplicate Detection
- Ballot box stuffing
- Duplicate respondent IDs
- IP duplicates

## Prompt de IA: Soft Launch Analysis

```markdown
Analiza los siguientes datos de soft launch.

**Datos**:
{{soft_launch_data}}

**Target n**: {{target_n}}
**Duracion esperada**: {{expected_loi}} minutos
**Quotas**: {{quota_targets}}

Evalua:
1. **Calidad de datos**
   - Tasa de speeders (< 1/3 median LOI)
   - Straightliners en matrices
   - Quality scores

2. **Distribucion**
   - Screeners funcionan correctamente
   - Quotas balanceadas
   - Respuestas variadas en preguntas clave

3. **Drop-off**
   - Puntos de abandono
   - Preguntas problematicas

4. **Anomalias**
   - Patrones sospechosos
   - Respuestas inconsistentes

Recomendacion: Go / No-Go / Needs Review
```

## Prompt de IA: OE Coding

```markdown
Codifica las siguientes respuestas abiertas.

**Pregunta**: {{question_text}}
**Respuestas**:
{{open_end_responses}}

Crea un coding schema que:
1. Identifique temas principales (max 10 categorias)
2. Agrupe respuestas similares
3. Defina cada categoria claramente
4. Proporcione ejemplos de cada una

Para cada respuesta original, asigna:
- Codigo(s) de categoria
- Confianza (Alta/Media/Baja)
- Notas si es ambigua

Formato de salida:
1. Coding schema (tabla)
2. Respuestas codificadas (tabla)
3. Resumen de distribucion
```

## Checklist de Soft Launch

### Pre-Soft Launch
- [ ] Survey en cuenta cliente
- [ ] Links de distribucion activos
- [ ] Quotas configuradas
- [ ] Quality checks activos
- [ ] Panel briefed (si aplica)

### Durante Soft Launch
- [ ] Monitorear completions en tiempo real
- [ ] Revisar primeras respuestas manualmente
- [ ] Verificar screeners y terminates
- [ ] Confirmar quotas tracking

### Post-Soft Launch
- [ ] Analisis de metricas de calidad
- [ ] Revisar open-ends para coding
- [ ] Documento de Go/No-Go
- [ ] Aprobacion de RM para full launch

## Checklist de Full Launch

### Monitoreo Diario
- [ ] Completions vs target
- [ ] Quota balance
- [ ] Quality score average
- [ ] Drop-off por pregunta
- [ ] OE coding progress

### Alertas a Configurar
- [ ] n < esperado por dia
- [ ] Quality score < 50
- [ ] Quota imbalance > 20%
- [ ] High drop-off (>10%)

## Tips para el Research Manager

1. **Nunca saltarse soft launch**: Es la ultima oportunidad de corregir errores.

2. **Revisar respuestas manualmente**: Los primeros 20-30 completes, leerlos uno por uno.

3. **Comunicar status al cliente**: Updates diarios durante fieldwork activo.

4. **Actuar rapido en anomalias**: Un dia de datos malos es un dia perdido.

5. **Documentar decisiones**: Si se ajusta algo mid-field, documentarlo.

## Errores Comunes a Evitar

- Lanzar full field sin revisar soft launch
- Ignorar drop-off alto ("ya veremos")
- No monitorear quotas hasta el final
- Olvidar cerrar el survey al completar
- No guardar backup de datos antes de cerrar

## Siguiente Fase
Con el fieldwork completo, comenzar **Fase 7: Analysis Plan**.
