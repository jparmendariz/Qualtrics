# Fase 3: Kick Off Meeting - Estructura y Captura

## Objetivo
Preparar, ejecutar y documentar el Kick Off Meeting para alinear objetivos, scope y timeline con el cliente.

## Trigger
- Matriz de Stakeholders completada (Fase 2)
- Fecha de KO confirmada

## Tiempo Estimado
- Preparacion: 1-2 dias
- Meeting: 1-2 horas
- Documentacion: 1 dia

## Que se Automatiza

### 1. Generacion de Agenda
La IA crea agenda personalizada basada en:
- Tipo de proyecto (Brand, CX, Segmentation, etc.)
- Stakeholders confirmados
- Duracion del meeting
- Temas prioritarios del dossier

### 2. Presentacion de KO (KO Deck)
Template pre-poblado con:
- Credenciales de Qualtrics
- Contexto del cliente (del Dossier)
- Timeline preliminar
- Equipo asignado
- Proximos pasos

### 3. Transcripcion Automatica
- Grabacion del meeting (con permiso)
- Transcripcion en tiempo real
- Identificacion de speakers
- Resumen automatico post-meeting

## Entregables

### 1. Agenda de Kick Off
```markdown
# Agenda: Kick Off - [Cliente] [Proyecto]
**Fecha**: [DD/MM/YYYY]
**Duracion**: [X] minutos
**Asistentes**: [Lista]

## Objetivos del Meeting
1. Alinear objetivos de investigacion
2. Confirmar scope y entregables
3. Establecer timeline y milestones
4. Identificar riesgos y dependencias

## Agenda

| Tiempo | Tema | Responsable |
|--------|------|-------------|
| 0-5 min | Bienvenida e introducciones | [RM] |
| 5-15 min | Presentacion de Qualtrics | [RM] |
| 15-30 min | Contexto del negocio (cliente) | [Cliente] |
| 30-50 min | Objetivos y preguntas de research | [RM + Cliente] |
| 50-60 min | Timeline y proximos pasos | [RM] |

## Preguntas Clave a Responder
- ¿Cual es la decision de negocio que depende de este research?
- ¿Quienes son las audiencias objetivo?
- ¿Que hipotesis tienen actualmente?
- ¿Como se define el exito?
```

### 2. KO Deck (Presentacion)
Estructura estandar:
1. Titulo y equipo
2. Sobre Qualtrics
3. Nuestra comprension del contexto
4. Metodologia propuesta
5. Timeline preliminar
6. Equipo del proyecto
7. Proximos pasos

### 3. Transcripcion Anotada
```markdown
# Transcripcion: KO Meeting - [Cliente]
**Fecha**: [DD/MM/YYYY]

## Resumen Ejecutivo
[3-5 bullets con los puntos clave]

## Decisiones Tomadas
- [Decision 1]
- [Decision 2]

## Action Items
| Item | Responsable | Deadline |
|------|-------------|----------|
| [Tarea] | [Nombre] | [Fecha] |

## Transcripcion Completa
[Timestamp] [Speaker]: [Texto]
...
```

## Workflow en RX Hub

```
PRE-MEETING
1. Usuario selecciona fecha y asistentes
   └── Sistema carga datos de Fase 1 y 2

2. IA genera agenda borrador
   └── Usuario revisa y ajusta

3. IA genera KO Deck borrador
   └── Usuario personaliza y aprueba

4. Sistema genera checklist pre-KO
   └── Usuario verifica preparacion

DURANTE MEETING
5. Usuario activa grabacion/transcripcion
   └── Sistema transcribe en tiempo real

6. Usuario toma notas adicionales
   └── Se vinculan a timestamps

POST-MEETING
7. IA genera resumen automatico
   └── Extrae decisiones y action items

8. Usuario valida y distribuye
   └── Avanza a Fase 4
```

## Cuestionario Estrategico del KO

El RM debe obtener respuestas a estas preguntas clave:

### Challenges & Key Decisions
- ¿Cuales son los principales desafios de negocio?
- ¿Que decisiones dependen de este research?
- ¿Que pasa si no hacemos este estudio?

### Central Question
- ¿Cual es LA pregunta principal que debemos responder?
- ¿Que otras preguntas secundarias son importantes?

### Target Audience
- ¿Quienes son las audiencias a investigar?
- ¿Como los segmentamos (criterios)?
- ¿Cuantos necesitamos por segmento?

### Stakeholders
- ¿Quienes usaran los resultados?
- ¿Como presentamos los hallazgos?
- ¿Hay stakeholders que debemos considerar?

### Definition of Success
- ¿Como sabremos que el research fue exitoso?
- ¿Que metricas o KPIs medimos?
- ¿Que decisiones esperan poder tomar?

### Timeline & Constraints
- ¿Hay fechas criticas (lanzamientos, presentaciones)?
- ¿Que restricciones de presupuesto existen?
- ¿Hay estudios previos que debamos considerar?

## Prompt de IA: Generador de Agenda

```markdown
Eres un Senior Research Manager preparando un Kick Off Meeting.

**Cliente**: {{client_name}}
**Proyecto**: {{project_name}}
**Tipo**: {{project_type}} (Brand/CX/Segmentation/etc.)
**Duracion**: {{duration}} minutos
**Asistentes cliente**: {{client_attendees}}
**Asistentes internos**: {{internal_attendees}}

Contexto del cliente:
{{dossier_summary}}

Genera una agenda de KO que:
1. Maximice el tiempo para entender objetivos del cliente
2. Incluya preguntas estrategicas especificas para este tipo de proyecto
3. Reserve tiempo para alinear timeline
4. Permita flexibilidad para temas emergentes

Formato: Tabla con tiempos, temas y responsables.
```

## Prompt de IA: Resumen Post-Meeting

```markdown
Analiza la siguiente transcripcion de Kick Off Meeting.

**Transcripcion**:
{{transcription}}

Extrae:
1. **Resumen ejecutivo** (3-5 bullets)
2. **Objetivos de research confirmados**
3. **Audiencias target definidas**
4. **Decisiones tomadas en el meeting**
5. **Action items** con responsables
6. **Riesgos o concerns mencionados**
7. **Timeline acordado**

Formato estructurado y conciso.
```

## Checklist Pre-KO

### Logistica
- [ ] Calendario enviado a todos los asistentes
- [ ] Link de videoconferencia configurado
- [ ] Grabacion autorizada por cliente
- [ ] Presentacion lista y testeada

### Materiales
- [ ] Dossier de Contexto revisado
- [ ] KO Deck personalizado
- [ ] Lista de preguntas preparada
- [ ] Timeline preliminar listo

### Equipo
- [ ] Roles asignados (quien presenta, quien toma notas)
- [ ] Backup plan si alguien no puede asistir
- [ ] Contacto de emergencia del cliente

## Checklist Post-KO

- [ ] Transcripcion generada y revisada
- [ ] Resumen enviado al cliente (24h max)
- [ ] Action items distribuidos
- [ ] Brief inicial actualizado con inputs
- [ ] Fecha de siguiente touchpoint confirmada

## Tips para el Research Manager

1. **Preparar mas de lo necesario**: Mejor tener preguntas de sobra.

2. **Escuchar mas que hablar**: El KO es para ENTENDER al cliente.

3. **Documentar TODO**: Lo que no se escribe se olvida.

4. **Confirmar entendimiento**: Parafrasear lo que el cliente dice.

5. **No prometer de mas**: Ser realista con timeline y scope.

## Errores Comunes a Evitar

- Dominar la conversacion en lugar de escuchar
- No grabar el meeting (con autorizacion)
- Olvidar preguntar por estudios previos
- No confirmar quien aprueba el research
- Asumir que todos entienden la metodologia

## Siguiente Fase
Con el KO documentado, comenzar **Fase 4: Briefing & Survey Design**.
