# Arquitectura de RX Hub

## Vision General

RX Hub sigue una arquitectura modular basada en fases, donde cada fase del proceso de research es un modulo independiente con sus propios componentes, prompts y validaciones.

```
┌─────────────────────────────────────────────────────────────────┐
│                         RX HUB                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Dashboard │  │ Projects │  │  Phases  │  │ Settings │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                      PHASE MODULES                               │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ P1  │ │ P2  │ │ P3  │ │ P4  │ │ P5  │ │ P6  │ │ P7  │ ...   │
│  │PreKO│ │PostK│ │ KO  │ │Brief│ │Prog │ │Launc│ │Analy│       │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘       │
├─────────────────────────────────────────────────────────────────┤
│                      CORE SERVICES                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │  AI Engine │  │  Qualtrics │  │  Database  │                 │
│  │  (Gemini)  │  │    API     │  │  (SQLite)  │                 │
│  └────────────┘  └────────────┘  └────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

## Principios de Diseno

### 1. Modularidad por Fase
Cada fase del proceso RX es un modulo autocontenido:
- Componentes propios
- Prompts de IA especificos
- Validaciones y checklists
- Templates asociados

### 2. Flujo Guiado (Wizard Pattern)
Los usuarios navegan por wizards que:
- Explican cada paso
- Pre-llenan datos de fases anteriores
- Validan antes de avanzar
- Generan entregables automaticamente

### 3. IA como Asistente
La IA (Gemini) esta integrada para:
- Generar borradores
- Sugerir mejoras
- Validar contenido
- No reemplazar el juicio del RM

### 4. Offline-First (Fase 1)
En el MVP:
- Todo funciona localmente
- Exporta archivos para uso manual
- No requiere conexion constante

## Estructura de Datos

### Project (Proyecto)
```typescript
interface Project {
  id: string;
  opp: string;                    // Salesforce Opportunity ID
  clientName: string;
  projectName: string;
  createdAt: Date;
  currentPhase: PhaseType;
  status: 'active' | 'completed' | 'on-hold';
  team: TeamMember[];
  phases: PhaseProgress[];
}
```

### Phase (Fase)
```typescript
interface Phase {
  id: PhaseType;
  name: string;
  description: string;
  checklist: ChecklistItem[];
  deliverables: Deliverable[];
  aiPrompts: AIPrompt[];
  estimatedDays: number;
}

type PhaseType =
  | 'pre-kickoff'
  | 'post-kickoff'
  | 'kickoff-meeting'
  | 'briefing-design'
  | 'programming-qc'
  | 'launch-monitoring'
  | 'analysis-plan'
  | 'analysis-insights'
  | 'report-qc';
```

### Deliverable (Entregable)
```typescript
interface Deliverable {
  id: string;
  phaseId: PhaseType;
  name: string;
  type: 'document' | 'presentation' | 'spreadsheet' | 'code';
  template?: string;
  content?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  generatedByAI: boolean;
}
```

## Flujo de Datos

```
Usuario Input
     │
     ▼
┌─────────────┐
│  UI Layer   │  ← React Components
└─────────────┘
     │
     ▼
┌─────────────┐
│   Hooks     │  ← useProject, usePhase, useAI
└─────────────┘
     │
     ▼
┌─────────────┐
│  Services   │  ← projectService, phaseService
└─────────────┘
     │
     ├─────────────────┬─────────────────┐
     ▼                 ▼                 ▼
┌─────────┐     ┌─────────┐      ┌─────────┐
│   AI    │     │Qualtrics│      │   DB    │
│ Gemini  │     │  API    │      │ SQLite  │
└─────────┘     └─────────┘      └─────────┘
```

## Modulos de Fase

### Fase 1: Pre-Kick Off
**Objetivo**: Generar Dossier de Contexto automatico

**Componentes**:
- `DossierGenerator` - Interfaz de generacion
- `CompetitorAnalysis` - Analisis de competidores
- `StakeholderMapper` - Mapeo de stakeholders

**AI Prompts**:
- `industry-research` - Investigacion de industria
- `competitor-analysis` - Analisis competitivo
- `stakeholder-profile` - Perfil de stakeholders

**Entregables**:
- Dossier de Contexto (PDF/DOC)

---

### Fase 2: Post-Kick Off
**Objetivo**: Enriquecer datos de contactos

**Componentes**:
- `ContactEnricher` - Enriquecimiento de datos
- `HierarchyMapper` - Mapeo de jerarquia
- `CommunicationPlanner` - Plan de comunicacion

**AI Prompts**:
- `contact-enrichment` - Enriquecimiento de contactos
- `decision-hierarchy` - Jerarquia de decision

**Entregables**:
- Lista de contactos enriquecida

---

### Fase 3: Kick Off Meeting
**Objetivo**: Preparar y documentar KO meeting

**Componentes**:
- `AgendaGenerator` - Generador de agenda
- `KODeckBuilder` - Constructor de presentacion
- `TranscriptionViewer` - Visor de transcripcion

**AI Prompts**:
- `ko-agenda` - Agenda de kick off
- `ko-questions` - Preguntas estrategicas
- `transcription-summary` - Resumen de transcripcion

**Entregables**:
- Agenda de KO
- KO Deck (PPT)
- Transcripcion anotada

---

### Fase 4: Briefing & Survey Design
**Objetivo**: Crear Brief y primer borrador de encuesta

**Componentes**:
- `BriefBuilder` - Constructor de brief
- `SurveyDesigner` - Disenador de encuesta
- `FlowVisualizer` - Visualizador de flujo

**AI Prompts**:
- `brief-consolidation` - Consolidacion de brief
- `survey-design` - Diseno de encuesta
- `question-optimization` - Optimizacion de preguntas

**Entregables**:
- Research Brief (DOC)
- Survey Flow (DOC)
- Master Questionnaire (DOC)

---

### Fase 5: Programming & QC
**Objetivo**: Generar codigo TXT y validar programacion

**Componentes**:
- `TXTGenerator` - Generador de TXT Qualtrics
- `QCChecklist` - Checklist de QC
- `SurveyPreview` - Preview de encuesta

**AI Prompts**:
- `txt-conversion` - Conversion a TXT
- `programming-qc` - QC de programacion
- `logic-validation` - Validacion de logica

**Entregables**:
- Archivo TXT para importar
- QC Documentation

---

### Fase 6: Launch & Monitoring
**Objetivo**: Monitorear soft launch y codificar OEs

**Componentes**:
- `SoftLaunchDashboard` - Dashboard de soft launch
- `OECoder` - Codificador de respuestas abiertas
- `DataQualityMonitor` - Monitor de calidad

**AI Prompts**:
- `soft-launch-analysis` - Analisis de soft launch
- `oe-coding` - Codificacion de OEs
- `bias-detection` - Deteccion de sesgos

**Entregables**:
- Soft Launch Report
- OE Coding Schema

---

### Fase 7: Analysis Plan
**Objetivo**: Crear plan de analisis automatico

**Componentes**:
- `AnalysisPlanBuilder` - Constructor de plan
- `DataCutsSuggester` - Sugeridor de data cuts
- `ReportFlowDesigner` - Disenador de flujo de reporte

**AI Prompts**:
- `analysis-plan` - Plan de analisis
- `data-cuts-suggestion` - Sugerencia de data cuts
- `report-structure` - Estructura de reporte

**Entregables**:
- Analysis Plan (DOC)

---

### Fase 8: Analysis & Insights
**Objetivo**: Generar insights y callouts automaticos

**Componentes**:
- `InsightGenerator` - Generador de insights
- `HeadlineCreator` - Creador de headlines
- `ReportDrafter` - Borrador de reporte

**AI Prompts**:
- `insight-generation` - Generacion de insights
- `headline-creation` - Creacion de headlines
- `what-so-what-now-what` - Framework de insights

**Entregables**:
- Key Insights Document
- Report Draft

---

### Fase 9: Report QC
**Objetivo**: Validar reporte final automaticamente

**Componentes**:
- `ReportValidator` - Validador de reporte
- `CrosstabComparator` - Comparador con crosstabs
- `NarrativeChecker` - Verificador de narrativa

**AI Prompts**:
- `report-validation` - Validacion de reporte
- `stat-verification` - Verificacion estadistica
- `narrative-coherence` - Coherencia narrativa

**Entregables**:
- QC Report
- Final Report (approved)

## Integracion con Qualtrics

### Fase 1: Manual (MVP)
```
RX Hub genera archivo .txt
         │
         ▼
Usuario descarga archivo
         │
         ▼
Usuario importa en Qualtrics manualmente
```

### Fase 2: API (Futuro)
```
RX Hub → Qualtrics API
         │
         ├── Create Survey
         ├── Update Questions
         ├── Activate Distribution
         └── Fetch Responses
```

## Integracion con Gemini

### Configuracion
```typescript
// lib/gemini/client.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiClient = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
```

### Uso de Prompts
```typescript
// lib/gemini/prompts/survey-design.ts
export const surveyDesignPrompt = (context: SurveyContext) => `
You are a Senior Research Consultant...
${context.objectives}
${context.targetAudience}
...
`;
```

### Estructura de Prompts
Cada prompt esta versionado y documentado:
```
prompts/
├── phase-1/
│   ├── industry-research.md
│   └── stakeholder-profile.md
├── phase-4/
│   ├── survey-design.md
│   └── question-optimization.md
└── phase-5/
    └── txt-conversion.md
```

## Seguridad y Permisos

### Fase 1 (Local)
- Sin autenticacion (localhost)
- Datos en SQLite local

### Fase 2 (Web Interna)
- SSO con Qualtrics
- Roles: Admin, RM, Viewer
- Audit log de cambios

## Performance

### Objetivos
- Time to First Byte: < 200ms
- Generacion de documentos: < 5s
- AI responses: < 10s

### Estrategias
- SSR para paginas criticas
- Streaming de respuestas AI
- Cache de prompts frecuentes

## Testing

### Unit Tests
- Componentes con React Testing Library
- Servicios con Jest

### Integration Tests
- Flujos completos con Playwright

### AI Tests
- Prompts con respuestas esperadas
- Regression de calidad

## Deployment

### Fase 1: Localhost
```bash
npm run dev
# http://localhost:3000
```

### Fase 2: Vercel/Internal Server
```bash
npm run build
npm run start
# O deploy a Vercel
```

## Monitoreo

- Error tracking: Sentry
- Analytics: Posthog (self-hosted)
- Logs: Console (dev) / CloudWatch (prod)
