# Fase 5: Programming & QC

## Objetivo
Convertir el Master Questionnaire en una encuesta funcional en Qualtrics, validada y lista para lanzamiento.

## Trigger
- Master Questionnaire aprobado (Fase 4)

## Tiempo Estimado
- Programming: 3-5 dias habiles
- QC interno: 1-2 dias
- UAT cliente: 2-3 dias

## Que se Automatiza

### 1. Generacion de Archivo TXT
La IA convierte el Master Questionnaire a formato TXT avanzado de Qualtrics:
- Estructura de bloques
- Preguntas con tipos especificos
- Opciones de respuesta
- Embedded Data

### 2. Auditoria de Programacion
Validacion automatica de:
- IDs unicos y correctos
- Tipos de pregunta validos
- Sintaxis correcta
- Coherencia con Master Questionnaire

## Entregables

### 1. Archivo TXT para Importacion

```
[[AdvancedFormat]]

[[ED:opp:QUAL12345]]
[[ED:Q_TotalDuration]]
[[ED:Q_BallotBoxStuffing]]
[[ED:Q_RelevantIDDuplicate]]
[[ED:gc]]
[[ED:term_reason]]

[[Block:Screeners]]

[[Question:MC:SingleAnswer]]
[[ID:S1_AGE]]
What is your age?
[[Choices]]
Under 18
18-24
25-34
35-44
45-54
55-64
65 or older

[[PageBreak]]

[[Question:MC:MultipleAnswer]]
[[ID:S2_CATEGORY]]
Which of the following categories have you purchased in the past 3 months? (Select all that apply)
[[Choices]]
Electronics
Clothing
Home goods
Food & beverage
None of these

[[Block:Main Survey]]

[[Question:Matrix:SingleAnswer]]
[[ID:Q1_SATIS]]
How satisfied are you with the following aspects of [Brand]?
[[Choices]]
Product quality
Customer service
Pricing
Ease of purchase
[[Answers]]
Very dissatisfied
Somewhat dissatisfied
Neither satisfied nor dissatisfied
Somewhat satisfied
Very satisfied

[[PageBreak]]

[[Question:TextEntry:SingleLine]]
[[ID:Q2_FEEDBACK]]
What is the primary reason for your rating above?
```

### 2. QC Documentation

| Check | Status | Notes |
|-------|--------|-------|
| IDs unicos | Pass/Fail | [Detalles] |
| Sintaxis valida | Pass/Fail | [Detalles] |
| Bloques completos | Pass/Fail | [Detalles] |
| Preguntas vs Master | Pass/Fail | [Detalles] |

### 3. Survey en Sandbox
- Link de preview
- Credenciales de acceso
- Version/fecha de build

## Workflow en RX Hub

```
PROGRAMMING
1. Usuario carga Master Questionnaire
   └── O lo importa de Fase 4

2. IA genera archivo TXT automaticamente
   └── Conversion de Word a formato Qualtrics

3. Sistema valida sintaxis
   └── Muestra errores si los hay

4. Usuario descarga TXT
   └── Importa manualmente a Qualtrics

5. Usuario completa programacion manual
   └── Logic, Terminates, Validations, MaxDiff

QC
6. LA completa Programming Checks
   └── Checklist interno

7. QC Analyst revisa
   └── Checklist de QC

8. UAT con cliente
   └── Log de cambios

9. Migracion a cuenta cliente
   └── Survey listo para launch
```

## Formato TXT Avanzado - Especificaciones

### Estructura Basica
```
[[AdvancedFormat]]

[[ED:field_name:value]]     # Embedded Data

[[Block:Block Name]]        # Inicio de bloque

[[Question:Type:SubType]]   # Pregunta
[[ID:QUESTION_ID]]          # ID unico (max 15 chars)
Question text here
[[Choices]]                 # Para MC
option 1
option 2
[[Answers]]                 # Para Matrix
answer 1
answer 2

[[PageBreak]]               # Salto de pagina
```

### Tipos de Pregunta Soportados

| Tipo | Subtipo | Ejemplo |
|------|---------|---------|
| MC | SingleAnswer | Radio buttons |
| MC | MultipleAnswer | Checkboxes |
| MC | Dropdown | Dropdown menu |
| Matrix | SingleAnswer | Grid single |
| Matrix | MultipleAnswer | Grid multi |
| TextEntry | SingleLine | Input corto |
| TextEntry | Essay | Texto largo |
| ConstantSum | - | Suma = 100 |
| RankOrder | - | Drag & drop |
| DB | - | Texto descriptivo |
| Slider | - | Barra deslizante |

### Lo que NO va en el TXT
Estos elementos se configuran manualmente en Qualtrics:
- Display Logic
- Skip Logic
- Terminate Logic
- Validations (force response, etc.)
- Randomizations complejas
- Forms
- MaxDiff
- Conjoint
- Quotas
- Survey Flow avanzado

## Prompt de IA: TXT Conversion

```markdown
Eres un experto en programacion de encuestas Qualtrics.

Tu tarea es convertir el siguiente Master Questionnaire a formato TXT avanzado de Qualtrics.

**Master Questionnaire**:
{{questionnaire_content}}

Reglas CRITICAS:
1. Usar [[AdvancedFormat]] al inicio
2. IDs de pregunta MAXIVO 15 caracteres
3. IDs UNICOS (no repetir)
4. NO incluir Display Logic, Skip Logic, Terminates
5. Usar [[PageBreak]] o linea en blanco para separar paginas
6. Embedded Data al inicio con [[ED:field:value]]

Para cada pregunta:
- Identificar el tipo correcto (MC, Matrix, TextEntry, etc.)
- Extraer el ID del documento o crear uno descriptivo
- Copiar texto exacto de la pregunta
- Listar todas las opciones de respuesta

Formato de salida: Codigo TXT listo para copiar y pegar en TextEdit.
```

## Proceso de QC (Quality Control)

### QC del Lead Analyst (LA)

**Design Checks (19 items)**:
- [ ] Business Questions alineadas con survey
- [ ] Screeners cubren todos los criterios
- [ ] Quotas documentadas
- [ ] Survey Outline completo
- [ ] Screeners list con logica
- [ ] Quotas list con targets
- [ ] Logic documentada por pregunta
- [ ] Randomizations especificadas
- [ ] Embedded Data definido
- [ ] Question Types correctos
- [ ] Question Labels unicos (<20 chars)
- [ ] Funcionalidad pretendida clara

**Programming Checks**:
- [ ] Master doc es la version final
- [ ] Survey creado en sandbox
- [ ] IDs coinciden con Master
- [ ] Todas las preguntas programadas
- [ ] Opciones de respuesta correctas
- [ ] Embedded Data configurado
- [ ] Page breaks en lugares correctos

### QC del Quality Control Analyst

**Programming QC (40+ subtasks)**:
- [ ] Review completo de programacion
- [ ] Logic funciona correctamente
- [ ] Terminates redirigen bien
- [ ] Quotas configuradas
- [ ] Randomizaciones funcionan
- [ ] Mobile responsive
- [ ] Tiempos de carga aceptables
- [ ] Sin errores de ortografia
- [ ] Consistencia de formato

## UAT (User Acceptance Testing)

### Template de UAT Log

| Question Label | Change Description | Evaluator | Date Found | Severity | Status | Date Fixed |
|----------------|-------------------|-----------|------------|----------|--------|------------|
| S1_AGE | Agregar opcion "Prefer not to say" | Client | 01/15 | Medium | Fixed | 01/16 |

### Severidades
- **Critical**: Blocker, no puede lanzar
- **High**: Error significativo, debe corregirse
- **Medium**: Mejora importante
- **Low**: Nice to have

## Checklist Pre-Launch

### Programacion
- [ ] Todas las preguntas del Master estan programadas
- [ ] Logic funciona en todos los paths
- [ ] Terminates configurados correctamente
- [ ] Quotas activas (si aplica)
- [ ] Survey testeado end-to-end

### Configuracion
- [ ] Survey settings correctos (language, etc.)
- [ ] Response export configurado
- [ ] Email triggers (si aplica)
- [ ] Thank you page configurada

### Migracion
- [ ] Survey copiado a cuenta cliente
- [ ] Permisos de acceso configurados
- [ ] Links de distribucion generados
- [ ] Backup del survey guardado

## Tips para el Research Manager

1. **Nunca saltarse QC**: Un error en produccion cuesta 10x mas que en desarrollo.

2. **Documentar TODO**: El UAT log es evidencia de aprobacion del cliente.

3. **Testear como respondente**: Completar el survey completo antes de UAT.

4. **Version control**: Guardar cada version importante del survey.

5. **Comunicar tiempos**: El cliente debe saber que UAT toma tiempo.

## Errores Comunes a Evitar

- Programar desde un documento desactualizado
- No verificar IDs duplicados
- Olvidar configurar terminates
- No testear en mobile
- Lanzar sin aprobacion escrita del cliente

## Siguiente Fase
Con el survey aprobado, preparar **Fase 6: Launch & Data Monitoring**.
