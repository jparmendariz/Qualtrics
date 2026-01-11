# Fase 2: Post-Kick Off - Mapeo de Contactos y Enriquecimiento

## Objetivo
Enriquecer los datos de stakeholders para personalizar comunicacion y entender la jerarquia de toma de decisiones.

## Trigger
- Dossier de Contexto aprobado (Fase 1 completada)
- Contactos iniciales identificados por Sales

## Tiempo Estimado
- 1-2 dias habiles

## Que se Automatiza

### 1. Identificacion de Contactos
- Nombres completos verificados
- Correos electronicos corporativos
- Numeros de telefono (cuando disponibles)
- Perfiles de LinkedIn actualizados

### 2. Mapeo de Cargos
- Titulo oficial
- Departamento
- Nivel jerarquico
- Tiempo en el cargo

### 3. Jerarquia de Decision
- Identificar decision-makers finales
- Influenciadores clave
- Gatekeepers
- End-users del research

### 4. Personalizacion de Comunicacion
- Preferencias de comunicacion
- Horarios optimos
- Tono apropiado por stakeholder
- Temas de interes profesional

## Entregables

### Matriz de Stakeholders

| Nombre | Cargo | Email | Rol en Decision | Prioridad | Notas |
|--------|-------|-------|-----------------|-----------|-------|
| [Nombre] | [Titulo] | [email] | Decision Maker | Alta | [Contexto] |
| [Nombre] | [Titulo] | [email] | Influencer | Media | [Contexto] |
| [Nombre] | [Titulo] | [email] | End User | Baja | [Contexto] |

### Mapa de Decision

```
┌─────────────────────────────────────┐
│         DECISION MAKER              │
│     [Nombre - VP Marketing]         │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌───────┐    ┌───────┐    ┌───────┐
│Influen│    │Influen│    │Gatekpr│
│[Nom1] │    │[Nom2] │    │[Nom3] │
└───────┘    └───────┘    └───────┘
```

## Workflow en RX Hub

```
1. Sistema carga contactos del Dossier
   └── Lista inicial de stakeholders

2. Usuario agrega contactos adicionales
   └── De Sales, correos, etc.

3. IA enriquece cada contacto
   ├── Busca perfil LinkedIn
   ├── Verifica email
   └── Extrae informacion profesional

4. Usuario asigna roles
   └── Decision Maker, Influencer, etc.

5. Sistema genera mapa de decision
   └── Visualizacion de jerarquia

6. Matriz aprobada
   └── Avanza a Fase 3
```

## Fuentes de Datos

### Automaticas
- LinkedIn (perfiles publicos)
- Sitio web corporativo
- Comunicados de prensa
- Eventos/conferencias

### Manuales
- Informacion de Sales
- Correos previos
- Tarjetas de presentacion
- Conversaciones telefonicas

## Prompt de IA Principal

```markdown
Eres un especialista en Business Development e inteligencia de contactos.

Tu tarea es enriquecer el perfil de un stakeholder clave.

**Nombre**: {{contact_name}}
**Empresa**: {{company_name}}
**Cargo conocido**: {{known_title}}
**LinkedIn URL**: {{linkedin_url}}

Extrae y documenta:
1. Titulo completo y departamento
2. Trayectoria profesional relevante (ultimos 3 roles)
3. Educacion y certificaciones
4. Temas de interes profesional (basado en publicaciones)
5. Conexiones relevantes en la industria
6. Estilo de comunicacion probable

Formato: Perfil estructurado de 1 pagina.
```

## Clasificacion de Roles

### Decision Maker (DM)
- Tiene autoridad para aprobar presupuesto
- Firma contratos
- Generalmente C-level o VP

### Influencer (INF)
- Afecta la decision del DM
- Experto en el tema
- Director o Manager senior

### Gatekeeper (GK)
- Controla acceso al DM
- Puede bloquear o facilitar
- Asistentes, Procurement

### End User (EU)
- Usara los resultados del research
- Puede dar feedback tecnico
- Analistas, Managers operativos

### Champion (CH)
- Promotor interno del proyecto
- Facilita reuniones
- Nuestro aliado clave

## Checklist de Validacion

- [ ] Todos los contactos tienen email verificado
- [ ] Cargos actualizados (< 6 meses)
- [ ] Al menos 1 Decision Maker identificado
- [ ] Jerarquia de decision mapeada
- [ ] Notas de personalizacion para contactos clave
- [ ] Puntos de contacto multiples por stakeholder

## Tips para el Research Manager

1. **Priorizar calidad sobre cantidad**: Mejor 5 contactos bien perfilados que 20 superficiales.

2. **Validar con Sales**: Ellos conocen las dinamicas internas.

3. **Buscar el Champion**: Identificar quien puede ser nuestro aliado interno.

4. **Documentar preferencias**: Si alguien prefiere Slack sobre email, anotarlo.

## Errores Comunes a Evitar

- Asumir que el contacto inicial es el Decision Maker
- No actualizar perfiles antes del KO
- Ignorar a stakeholders "menores" que pueden influir
- No preparar alternativas si el DM no asiste al KO

## Integracion con Herramientas

### Salesforce
- Importar contactos de la oportunidad
- Sincronizar actualizaciones

### LinkedIn Sales Navigator (Futuro)
- Enriquecimiento automatico
- Alertas de cambios de cargo

### Email Tools
- Verificacion de emails
- Tracking de aperturas

## Siguiente Fase
Con los contactos mapeados, preparar la **Fase 3: Kick Off Meeting**.
