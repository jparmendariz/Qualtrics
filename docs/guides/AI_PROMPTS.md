# Guia de Prompts de IA

Documentacion de todos los prompts de IA integrados en RX Hub, organizados por fase del proceso.

## Arquitectura de Prompts

```
src/prompts/
├── phase-1/                 # Pre-Kick Off
│   ├── industry-research.ts
│   ├── competitor-analysis.ts
│   └── stakeholder-profile.ts
├── phase-2/                 # Post-Kick Off
│   ├── contact-enrichment.ts
│   └── decision-hierarchy.ts
├── phase-3/                 # Kick Off Meeting
│   ├── ko-agenda.ts
│   ├── ko-questions.ts
│   └── transcription-summary.ts
├── phase-4/                 # Briefing & Survey Design
│   ├── brief-consolidation.ts
│   ├── survey-design.ts
│   └── question-optimization.ts
├── phase-5/                 # Programming & QC
│   ├── txt-conversion.ts
│   ├── programming-qc.ts
│   └── logic-validation.ts
├── phase-6/                 # Launch & Monitoring
│   ├── soft-launch-analysis.ts
│   ├── oe-coding.ts
│   └── bias-detection.ts
├── phase-7/                 # Analysis Plan
│   ├── analysis-plan.ts
│   ├── data-cuts-suggestion.ts
│   └── report-structure.ts
├── phase-8/                 # Analysis & Insights
│   ├── insight-generation.ts
│   ├── headline-creation.ts
│   └── what-so-what-now-what.ts
├── phase-9/                 # Report QC
│   ├── report-validation.ts
│   ├── stat-verification.ts
│   └── narrative-coherence.ts
└── shared/                  # Prompts compartidos
    ├── system-prompts.ts
    └── formatting.ts
```

## Estructura de un Prompt

```typescript
// src/prompts/phase-X/nombre-prompt.ts

export interface PromptInput {
  // Parametros requeridos
  requiredField: string;
  // Parametros opcionales
  optionalField?: string;
}

export interface PromptOutput {
  // Estructura de la respuesta esperada
  result: string;
  confidence: 'high' | 'medium' | 'low';
}

export const systemPrompt = `
Eres un [rol] especializado en [area].
Tu tarea es [objetivo].
`;

export const generatePrompt = (input: PromptInput): string => `
${systemPrompt}

**Contexto**:
${input.requiredField}

**Instrucciones**:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Formato de salida**:
[Especificacion]
`;
```

---

## Fase 1: Pre-Kick Off

### industry-research.ts
Genera investigacion de industria para el Dossier de Contexto.

```typescript
export const industryResearchPrompt = (input: {
  clientName: string;
  industry: string;
  website?: string;
}) => `
Eres un Research Analyst senior especializado en inteligencia de mercados.

**Cliente**: ${input.clientName}
**Industria**: ${input.industry}
**Sitio web**: ${input.website || 'No proporcionado'}

Investiga y documenta:
1. Tamano del mercado (global y regional)
2. Tasa de crecimiento anual (CAGR)
3. Principales tendencias (3-5)
4. Regulaciones relevantes
5. Ciclos estacionales del negocio
6. Drivers de la industria
7. Amenazas y oportunidades

Formato: Documento estructurado con secciones claras.
Tono: Profesional pero accesible.
Longitud: 1-2 paginas.
`;
```

### competitor-analysis.ts
Analiza competidores para el cliente.

```typescript
export const competitorAnalysisPrompt = (input: {
  clientName: string;
  industry: string;
  knownCompetitors?: string[];
}) => `
Eres un analista de inteligencia competitiva.

**Cliente**: ${input.clientName}
**Industria**: ${input.industry}
**Competidores conocidos**: ${input.knownCompetitors?.join(', ') || 'Identificar'}

Analiza:
1. Top 5 competidores directos
2. Para cada competidor:
   - Fortalezas principales
   - Debilidades conocidas
   - Posicionamiento de mercado
   - Share estimado
3. Matriz comparativa
4. Oportunidades de diferenciacion

Formato: Tabla comparativa + analisis narrativo.
`;
```

---

## Fase 4: Survey Design

### survey-design.ts
Genera borrador de encuesta basado en objetivos.

```typescript
export const surveyDesignPrompt = (input: {
  projectName: string;
  objectives: string[];
  targetAudience: string;
  methodology: 'brand' | 'cx' | 'segmentation' | 'product' | 'custom';
  maxDuration: number; // minutos
  maxQuestions: number;
}) => `
Eres un Senior Research Consultant especializado en diseno de encuestas.

**Proyecto**: ${input.projectName}
**Metodologia**: ${input.methodology}
**Duracion maxima**: ${input.maxDuration} minutos
**Preguntas maximas**: ${input.maxQuestions}

**Objetivos de Research**:
${input.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

**Audiencia Target**:
${input.targetAudience}

Disena una encuesta siguiendo best practices:

1. **Estructura**:
   - Screeners primero
   - Warm-up facil
   - Temas principales en medio
   - Sensitivos/demograficos al final

2. **Prevencion de sesgos**:
   - Randomizar opciones
   - Evitar preguntas leading
   - Sin double-barreled questions

3. **Para cada pregunta incluir**:
   - Question ID (max 15 chars)
   - Texto de pregunta
   - Tipo (MC, Matrix, TextEntry, etc.)
   - Opciones de respuesta
   - Logic si aplica

Formato: Documento estructurado listo para programacion.
`;
```

---

## Fase 5: Programming

### txt-conversion.ts
Convierte Master Questionnaire a formato TXT Qualtrics.

```typescript
export const txtConversionPrompt = (input: {
  questionnaireContent: string;
  oppId: string;
}) => `
Eres un experto en programacion de encuestas Qualtrics.

**Master Questionnaire**:
${input.questionnaireContent}

**OPP ID**: ${input.oppId}

Convierte a formato TXT avanzado de Qualtrics.

REGLAS CRITICAS:
1. Iniciar con [[AdvancedFormat]]
2. IDs de pregunta MAXIMO 15 caracteres
3. IDs deben ser UNICOS
4. NO incluir: Display Logic, Skip Logic, Terminates, Validations
5. Usar [[PageBreak]] para separar paginas
6. Embedded Data al inicio con [[ED:campo:valor]]

TIPOS VALIDOS:
- [[Question:MC:SingleAnswer]]
- [[Question:MC:MultipleAnswer]]
- [[Question:MC:Dropdown]]
- [[Question:Matrix:SingleAnswer]]
- [[Question:Matrix:MultipleAnswer]]
- [[Question:TextEntry:SingleLine]]
- [[Question:TextEntry:Essay]]
- [[Question:ConstantSum]]
- [[Question:RankOrder]]
- [[Question:Slider]]
- [[Question:DB]]

Para cada pregunta:
- Determinar tipo correcto
- Asignar ID unico descriptivo
- Copiar texto exacto
- Listar opciones

Formato: Codigo TXT listo para copiar a TextEdit e importar.
`;
```

---

## Fase 8: Analysis & Insights

### insight-generation.ts
Genera Key Findings a partir de datos.

```typescript
export const insightGenerationPrompt = (input: {
  projectName: string;
  objectives: string[];
  dataSummary: string;
  benchmarks?: string;
}) => `
Eres un Senior Research Consultant generando Key Findings.

**Proyecto**: ${input.projectName}

**Objetivos**:
${input.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

**Datos**:
${input.dataSummary}

${input.benchmarks ? `**Benchmarks**:\n${input.benchmarks}` : ''}

Genera 5-8 Key Findings usando el framework What? So What? Now What?

Para cada finding:
1. **Headline** (max 15 palabras, insight no descripcion)
2. **What?** - El dato objetivo
3. **So What?** - Implicacion de negocio
4. **Now What?** - Recomendacion accionable
5. **Supporting Data** - 2-3 stats de soporte
6. **Confidence** - Alta/Media/Baja (basado en base size)
7. **Priority** - 1-5

Criterios de priorizacion:
- Impacto en decisiones de negocio
- Magnitud del hallazgo
- Novedad vs expectativas
- Accionabilidad

Formato: Lista estructurada, priorizada de mayor a menor impacto.
`;
```

### headline-creation.ts
Genera headlines para slides individuales.

```typescript
export const headlineCreationPrompt = (input: {
  questionText: string;
  data: string;
  relatedObjective?: string;
  dataCuts?: string;
}) => `
Genera un headline impactante para esta slide de reporte.

**Pregunta**: ${input.questionText}
**Datos**: ${input.data}
${input.relatedObjective ? `**Objetivo relacionado**: ${input.relatedObjective}` : ''}
${input.dataCuts ? `**Data cuts relevantes**: ${input.dataCuts}` : ''}

REGLAS:
1. MAX 15 palabras
2. Debe comunicar INSIGHT, no descripcion
3. Incluir dato clave si es impactante
4. Evitar: "Results of...", "Scores for...", "Breakdown of..."

BUENOS EJEMPLOS:
- "Brand X leads awareness at 45% but trails competitors in consideration"
- "Price sensitivity peaks among 18-34, driving 42% brand switching"
- "Satisfaction drops 20 points for Gen Z, signaling experience gap"

MALOS EJEMPLOS:
- "Brand awareness results"
- "Satisfaction by age group"
- "Q5 responses"

Genera:
1. **Headline principal**
2. **Headline alternativo**
3. **Callout sugerido** (1-2 oraciones)
`;
```

---

## Prompts Compartidos

### system-prompts.ts
Personas base para diferentes roles.

```typescript
export const researchAnalystPersona = `
Eres un Research Analyst senior con 10+ anos de experiencia en investigacion de mercados.
Especialidades: Survey design, data analysis, insight generation.
Estilo: Riguroso, objetivo, orientado a datos.
`;

export const researchConsultantPersona = `
Eres un Senior Research Consultant especializado en transformar datos en estrategia.
Especialidades: Business insights, strategic recommendations, executive presentations.
Estilo: Estrategico, conciso, orientado a accion.
`;

export const programmerPersona = `
Eres un especialista en programacion de encuestas Qualtrics.
Especialidades: Survey logic, advanced formatting, QC.
Estilo: Tecnico, preciso, meticuloso.
`;
```

---

## Uso en Codigo

### Ejemplo de integracion con Gemini

```typescript
// src/lib/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiClient = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

// src/lib/gemini/generate.ts
import { geminiClient } from './client';
import { surveyDesignPrompt } from '@/prompts/phase-4/survey-design';

export async function generateSurveyDesign(input: SurveyDesignInput) {
  const prompt = surveyDesignPrompt(input);

  const result = await geminiClient.generateContent(prompt);
  const response = await result.response;

  return response.text();
}
```

### Ejemplo en componente React

```typescript
// src/components/phases/SurveyDesigner.tsx
'use client';

import { useState } from 'react';
import { generateSurveyDesign } from '@/lib/gemini/generate';

export function SurveyDesigner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const survey = await generateSurveyDesign({
        projectName: 'Brand Health Study',
        objectives: ['Measure awareness', 'Understand drivers'],
        targetAudience: 'Adults 25-54',
        methodology: 'brand',
        maxDuration: 15,
        maxQuestions: 30,
      });
      setResult(survey);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Survey'}
      </button>
      {result && <pre>{result}</pre>}
    </div>
  );
}
```

---

## Best Practices

### 1. Prompts Modulares
Mantener prompts pequenos y enfocados. Un prompt por tarea.

### 2. Inputs Tipados
Usar TypeScript interfaces para validar inputs.

### 3. Outputs Estructurados
Pedir formato especifico para facilitar parsing.

### 4. Context Windows
Considerar limites de tokens. Resumir inputs largos.

### 5. Temperature
- 0.3 para tareas factuales (conversion, validacion)
- 0.7 para tareas creativas (headlines, insights)

### 6. Versionamiento
Versionar prompts con cambios significativos.
Mantener changelog de modificaciones.

---

## Testing de Prompts

### Unit Tests
```typescript
// __tests__/prompts/survey-design.test.ts
import { surveyDesignPrompt } from '@/prompts/phase-4/survey-design';

describe('surveyDesignPrompt', () => {
  it('includes all objectives', () => {
    const prompt = surveyDesignPrompt({
      projectName: 'Test',
      objectives: ['Obj 1', 'Obj 2'],
      targetAudience: 'Adults',
      methodology: 'brand',
      maxDuration: 10,
      maxQuestions: 20,
    });

    expect(prompt).toContain('Obj 1');
    expect(prompt).toContain('Obj 2');
  });
});
```

### Regression Tests
Mantener golden outputs para comparar calidad.
