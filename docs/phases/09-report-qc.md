# Fase 9: Report QC (Quality Control Final)

## Objetivo
Validar el reporte final contra los datos originales, asegurando precision estadistica y coherencia narrativa.

## Trigger
- Draft de reporte completado (Fase 8)

## Tiempo Estimado
- 2-3 dias habiles

## Que se Automatiza

### 1. Validacion Cruzada
La IA compara automaticamente:
- Datos en slides vs crosstabs originales
- Base sizes reportados vs reales
- Calculos derivados (indexes, means)

### 2. Coherencia Narrativa
- Headlines consistentes con datos
- Conclusiones soportadas por evidencia
- Flujo logico del documento

### 3. Checklist Automatico
- Verificacion de todos los elementos requeridos
- Formato y branding
- Completitud

## Entregables

### 1. QC Report

```markdown
# Report QC: [Proyecto]
**Fecha de revision**: [DD/MM/YYYY]
**Revisor**: [Nombre]
**Version del reporte**: [X.X]

## Resumen Ejecutivo
- **Status**: Approved / Needs Revision / Critical Issues
- **Issues encontrados**: [X]
- **Issues criticos**: [X]

## Data Accuracy Check

### Slide-by-Slide Verification

| Slide | Stat Reported | Crosstab Value | Match | Notes |
|-------|---------------|----------------|-------|-------|
| 5 | 45% unaided | 45.2% | Yes | Rounded |
| 8 | n=523 | n=523 | Yes | - |
| 12 | Mean 4.2 | Mean 4.18 | Yes | Rounded |
| 15 | Index 112 | Index 108 | NO | Recalculate |

### Base Size Verification

| Slide | Reported Base | Actual Base | Flag |
|-------|---------------|-------------|------|
| 5 | n=500 | n=500 | OK |
| 12 | n=45 | n=45 | Low base |

### Stat Testing Verification

| Slide | Claim | Test Result | Valid |
|-------|-------|-------------|-------|
| 8 | "Sig. higher" | p<0.05 | Yes |
| 15 | "Trending higher" | p=0.08 | Review |

## Narrative Coherence Check

| Item | Status | Notes |
|------|--------|-------|
| Headlines match data | Pass/Fail | [Details] |
| Conclusions supported | Pass/Fail | [Details] |
| Recommendations actionable | Pass/Fail | [Details] |
| Flow is logical | Pass/Fail | [Details] |

## Format & Completeness

| Element | Present | Notes |
|---------|---------|-------|
| Cover slide | Yes/No | |
| Table of contents | Yes/No | |
| Methodology | Yes/No | |
| Base sizes on all slides | Yes/No | |
| Question text in notes | Yes/No | |
| Appendix | Yes/No | |

## Issues Log

| ID | Slide | Severity | Description | Resolution |
|----|-------|----------|-------------|------------|
| 1 | 15 | High | Index calculation error | Recalculate |
| 2 | 23 | Medium | Typo in headline | Fix |
| 3 | 8 | Low | Chart color inconsistent | Update |

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Lead Analyst | [Nombre] | [Fecha] | _______ |
| QC Analyst | [Nombre] | [Fecha] | _______ |
| Research Manager | [Nombre] | [Fecha] | _______ |
```

### 2. Final Approved Report
- Version final con correcciones
- Aprobaciones documentadas
- Listo para entrega a cliente

## Workflow en RX Hub

```
QC INTERNO
1. LA completa Report Checks
   └── Verificacion de datos

2. Sistema compara automaticamente
   └── Report data vs crosstabs

3. IA identifica discrepancias
   └── Lista de issues potenciales

4. QC Analyst revisa
   └── Valida findings de IA

5. Issues documentados
   └── QC Report generado

CORRECCIONES
6. LA corrige issues
   └── Actualiza reporte

7. QC verifica correcciones
   └── Re-check de items flagged

8. RM da sign-off final
   └── Aprobacion para entrega

ENTREGA
9. Enviar a cliente
   └── Version final + methodology

10. Documentar feedback
    └── Para post-mortem
```

## Prompt de IA: Data Validation

```markdown
Compara los siguientes datos del reporte con los crosstabs originales.

**Datos del Reporte**:
{{report_data}}

**Crosstabs Originales**:
{{crosstab_data}}

Para cada dato del reporte:
1. Localizar el valor correspondiente en crosstabs
2. Verificar si coinciden (considerando redondeo)
3. Flagear discrepancias

Output:
- Lista de matches confirmados
- Lista de discrepancias con detalles
- Recomendaciones de correccion
```

## Prompt de IA: Narrative Check

```markdown
Revisa la coherencia narrativa del siguiente reporte.

**Headlines**:
{{headlines}}

**Key Findings**:
{{key_findings}}

**Recommendations**:
{{recommendations}}

**Supporting Data**:
{{supporting_data}}

Evalua:
1. ¿Los headlines reflejan los datos?
2. ¿Los findings estan soportados por evidencia?
3. ¿Las recommendations son logicas dado los findings?
4. ¿El flujo narrativo es coherente?
5. ¿Hay contradicciones internas?

Para cada issue encontrado:
- Ubicacion (slide/section)
- Descripcion del problema
- Sugerencia de correccion
```

## Checklist de QC Completo

### Data Accuracy
- [ ] Todos los % coinciden con crosstabs (±1% por redondeo)
- [ ] Base sizes correctos en todas las slides
- [ ] Means y indexes verificados
- [ ] Stat testing es correcto
- [ ] Diferencias significativas estan marcadas

### Narrative
- [ ] Headlines son insights, no descripciones
- [ ] Cada claim tiene soporte de datos
- [ ] Recommendations son accionables
- [ ] Executive summary refleja key findings
- [ ] No hay contradicciones

### Completeness
- [ ] Cover slide presente
- [ ] Table of contents actualizado
- [ ] Methodology documentada
- [ ] Appendix con data completa
- [ ] Speaker notes con question text

### Format
- [ ] Branding correcto (logos, colores)
- [ ] Fonts consistentes
- [ ] Charts legibles
- [ ] Sin errores de ortografia
- [ ] Page numbers correctos

### Compliance
- [ ] Base sizes minimos respetados (n≥50)
- [ ] Caution notes donde aplica (n=50-75)
- [ ] Confidentiality statement presente
- [ ] Fecha de fieldwork incluida

## Severity Levels

### Critical
- Datos incorrectos que cambian conclusiones
- Errores estadisticos significativos
- Informacion confidencial expuesta
**Accion**: No entregar hasta corregir

### High
- Datos incorrectos menores
- Base sizes mal reportados
- Missing methodology
**Accion**: Corregir antes de entrega

### Medium
- Inconsistencias de formato
- Headlines mejorables
- Typos en contenido principal
**Accion**: Corregir si hay tiempo

### Low
- Typos en appendix
- Formato no estandar en areas secundarias
- Sugerencias de mejora
**Accion**: Opcional

## Process de Sign-Off

### 1. Lead Analyst
- Verifica que todos los datos son correctos
- Confirma que el analisis es solido
- Firma QC report

### 2. QC Analyst
- Revision independiente
- Verifica precision de datos
- Firma QC report

### 3. Research Manager
- Revision de alto nivel
- Valida que cumple con expectativas del cliente
- Aprueba para entrega
- Firma QC report

## Entrega al Cliente

### Pre-Delivery Checklist
- [ ] QC report firmado por todos
- [ ] Version final guardada
- [ ] Backup en cloud
- [ ] Email de entrega preparado
- [ ] Presentation slot confirmado (si aplica)

### Email Template

```
Subject: [Proyecto] - Final Report Delivery

Hi [Client Name],

Please find attached the final report for [Project Name].

Key highlights:
- [Finding 1]
- [Finding 2]
- [Finding 3]

We're available for a presentation walkthrough at your convenience.
Please let us know if you have any questions.

Best regards,
[RM Name]

Attachments:
- [Project]_Final_Report_[Date].pptx
- [Project]_Methodology.pdf (optional)
```

## Tips para el Research Manager

1. **Nunca saltarse QC**: Un error en el reporte daña credibilidad.

2. **Fresh eyes**: QC debe ser alguien que no hizo el analisis.

3. **Documentar todo**: El QC report es evidencia de diligencia.

4. **Dar tiempo suficiente**: QC no es algo para hacer en 1 hora.

5. **Cliente no es QC**: No enviar esperando que el cliente encuentre errores.

## Errores Comunes a Evitar

- Asumir que los numeros estan bien sin verificar
- QC superficial por presion de tiempo
- No documentar issues encontrados
- Entregar sin sign-off formal
- No guardar version final claramente versionada

## Post-Delivery

### Post-Mortem Meeting
Despues de cada proyecto, documentar:
- Que funciono bien
- Que se puede mejorar
- Lessons learned
- Actualizaciones a procesos

### Archive
- Guardar todos los materiales del proyecto
- Version final del reporte
- QC documentation
- Crosstabs y data files
- Comunicaciones clave

## Cierre del Proyecto

Con el reporte entregado y aceptado por el cliente, el proyecto se cierra formalmente. Documentar feedback para mejora continua del proceso.
