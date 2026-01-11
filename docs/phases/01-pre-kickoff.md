# Fase 1: Pre-Kick Off - Inteligencia de Negocio

## Objetivo
Generar automaticamente un **Dossier de Contexto** completo sobre el cliente antes del primer contacto formal.

## Trigger
- Apertura de oportunidad en Salesforce (Opportunity)

## Tiempo Estimado
- 2-5 dias habiles

## Que se Automatiza

### 1. Investigacion de Industria
La IA investiga automaticamente:
- Tamano del mercado
- Tendencias principales
- Regulaciones relevantes
- Ciclos estacionales

### 2. Analisis de Modelo de Negocio
- Fuentes de ingresos
- Segmentos de clientes
- Propuesta de valor
- Canales de distribucion

### 3. Mapeo de Competidores
- Competidores directos (top 3-5)
- Posicionamiento comparativo
- Fortalezas/debilidades conocidas
- Share of voice en el mercado

### 4. Perfil del Cliente
- Historia de la empresa
- Estructura organizacional
- Noticias recientes
- Presencia digital

### 5. Reconocimiento de Stakeholders
- Perfiles de LinkedIn de contactos clave
- Trayectorias profesionales
- Intereses y publicaciones
- Conexiones en comun

## Entregables

### Dossier de Contexto
Documento estructurado que incluye:

```markdown
# Dossier de Contexto: [Cliente]

## 1. Resumen Ejecutivo
[Parrafo de 3-4 lineas con lo esencial]

## 2. Sobre la Empresa
- Fundacion: [Ano]
- Sede: [Ubicacion]
- Empleados: [Rango]
- Ingresos estimados: [Rango]

## 3. Modelo de Negocio
[Descripcion de como genera valor]

## 4. Industria y Mercado
- Industria: [Nombre]
- Tamano del mercado: [USD]
- Crecimiento anual: [%]
- Principales tendencias:
  - [Tendencia 1]
  - [Tendencia 2]

## 5. Competidores Principales
| Competidor | Fortaleza | Debilidad |
|------------|-----------|-----------|
| [Comp 1]   | [...]     | [...]     |

## 6. Stakeholders Clave
### [Nombre del Contacto]
- Cargo: [Titulo]
- Trayectoria: [Resumen]
- Enfoque profesional: [Temas de interes]

## 7. Noticias Relevantes
- [Fecha]: [Titular] - [Fuente]

## 8. Oportunidades de Research
[Hipotesis iniciales sobre que podria investigarse]
```

## Workflow en RX Hub

```
1. Usuario crea nuevo proyecto
   └── Ingresa nombre del cliente y OPP

2. Sistema inicia generacion automatica
   └── Muestra progreso en tiempo real

3. IA investiga en paralelo
   ├── Industria
   ├── Competidores
   ├── Empresa
   └── Stakeholders

4. Se genera Dossier borrador
   └── Usuario revisa y edita

5. Dossier aprobado
   └── Se guarda y avanza a Fase 2
```

## Prompt de IA Principal

```markdown
Eres un Research Analyst senior especializado en inteligencia competitiva.

Tu tarea es crear un Dossier de Contexto completo para un cliente nuevo.

**Cliente**: {{client_name}}
**Industria aparente**: {{industry}}
**Sitio web**: {{website}}

Investiga y documenta:
1. Historia y antecedentes de la empresa
2. Modelo de negocio y propuesta de valor
3. Mercado objetivo y segmentos de clientes
4. Panorama competitivo (top 5 competidores)
5. Tendencias de la industria que podrian afectarle
6. Noticias recientes relevantes

Formato de salida: Documento estructurado con secciones claras.
Tono: Profesional pero accesible.
Longitud: 2-3 paginas.
```

## Checklist de Validacion

- [ ] Informacion basica de la empresa correcta
- [ ] Al menos 3 competidores identificados
- [ ] Tendencias de industria relevantes
- [ ] Stakeholders con perfiles verificados
- [ ] No hay informacion desactualizada (> 1 ano)
- [ ] Fuentes citadas cuando aplica

## Tips para el Research Manager

1. **Siempre verificar datos criticos**: La IA puede cometer errores en datos especificos como ingresos o fechas.

2. **Complementar con conocimiento interno**: Si Sales ya tiene informacion del cliente, agregarla al dossier.

3. **Priorizar stakeholders por rol**: Enfocarse en decision-makers primero.

4. **Actualizar antes del KO**: Si pasan varios dias, refrescar noticias recientes.

## Errores Comunes a Evitar

- Asumir que toda la informacion de IA es correcta sin verificar
- No incluir el contexto del proyecto especifico
- Olvidar mapear la jerarquia de decision
- No considerar subsidiarias o marcas relacionadas

## Siguiente Fase
Una vez aprobado el Dossier, avanzar a **Fase 2: Post-Kick Off** para el mapeo detallado de contactos.
