/**
 * Prompt for converting Master Questionnaire to Qualtrics TXT format
 * Phase 5: Programming & QC
 */

import { SURVEY_PROGRAMMER_PERSONA } from "../shared/system-prompts";

// ===========================================
// Types
// ===========================================

export interface TXTConversionInput {
  questionnaireContent: string;
  oppId: string;
  projectName?: string;
  additionalEmbeddedData?: Record<string, string>;
}

export interface TXTConversionOutput {
  txtContent: string;
  questionCount: number;
  blockCount: number;
  warnings: string[];
  manualConfigRequired: string[];
}

// ===========================================
// Reference Documentation
// ===========================================

const TXT_FORMAT_REFERENCE = `
## Formato TXT Avanzado de Qualtrics

### Estructura Base
\`\`\`
[[AdvancedFormat]]

[[ED:campo:valor]]

[[Block:Nombre del Bloque]]

[[Question:Tipo:Subtipo]]
[[ID:QUESTION_ID]]
Texto de la pregunta
[[Choices]]
opcion 1
opcion 2
[[Answers]]
respuesta 1
respuesta 2

[[PageBreak]]
\`\`\`

### Tipos de Pregunta Soportados

| Codigo | Descripcion | Uso |
|--------|-------------|-----|
| MC:SingleAnswer | Multiple Choice | Una sola respuesta (radio buttons) |
| MC:MultipleAnswer | Multiple Choice | Varias respuestas (checkboxes) |
| MC:Dropdown | Multiple Choice | Menu desplegable |
| MC:Select | Multiple Choice | Select box |
| MC:MultiSelect | Multiple Choice | Multi-select box |
| Matrix:SingleAnswer | Matrix | Grid con una respuesta por fila |
| Matrix:MultipleAnswer | Matrix | Grid con varias respuestas por fila |
| TextEntry:SingleLine | Text Entry | Campo de texto corto |
| TextEntry:Essay | Text Entry | Campo de texto largo |
| ConstantSum | Constant Sum | Suma que debe igualar un total |
| RankOrder | Rank Order | Ordenar items por preferencia |
| Slider | Slider | Barra deslizante |
| DB | Descriptive Block | Solo texto, sin respuesta |

### Reglas Criticas

1. **IDs de Pregunta**:
   - MAXIMO 15 caracteres
   - Sin espacios (usar guion bajo)
   - UNICOS en todo el survey
   - Descriptivos (ej: S1_AGE, Q1_AWARE)

2. **Embedded Data**:
   - Siempre al inicio, despues de [[AdvancedFormat]]
   - Formato: [[ED:nombre_campo:valor_default]]
   - Campos comunes: opp, Q_TotalDuration, gc, term_reason

3. **Page Breaks**:
   - Usar [[PageBreak]] para separar paginas
   - O dejar una linea en blanco entre preguntas

4. **Lo que NO incluir** (se configura manualmente):
   - Display Logic
   - Skip Logic
   - Terminate Logic
   - Validations (force response, etc.)
   - Randomizaciones complejas
   - Forms
   - MaxDiff
   - Conjoint
`;

// ===========================================
// Main Prompt
// ===========================================

export function generateTXTConversionPrompt(input: TXTConversionInput): string {
  const embeddedDataStr = input.additionalEmbeddedData
    ? Object.entries(input.additionalEmbeddedData)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n")
    : "Ninguno adicional";

  return `
${SURVEY_PROGRAMMER_PERSONA}

${TXT_FORMAT_REFERENCE}

---

## Tu Tarea

Convierte el siguiente Master Questionnaire a formato TXT avanzado de Qualtrics.

### Informacion del Proyecto
- **OPP ID**: ${input.oppId}
${input.projectName ? `- **Nombre del Proyecto**: ${input.projectName}` : ""}
- **Embedded Data Adicional**: ${embeddedDataStr}

### Master Questionnaire a Convertir

\`\`\`
${input.questionnaireContent}
\`\`\`

---

## Instrucciones Especificas

1. **Analizar el documento**:
   - Identificar todos los bloques/secciones
   - Clasificar cada pregunta por tipo
   - Extraer o generar IDs unicos

2. **Para cada pregunta**:
   - Determinar el tipo correcto de Qualtrics
   - Asignar ID de max 15 caracteres
   - Copiar texto EXACTO de la pregunta
   - Listar TODAS las opciones de respuesta
   - NO incluir instrucciones de logic

3. **Estructura del output**:
   - Iniciar con [[AdvancedFormat]]
   - Luego Embedded Data estandar
   - Luego los bloques en orden
   - Usar [[PageBreak]] entre secciones logicas

4. **Documentar lo que requiere configuracion manual**:
   - Display Logic que detectes
   - Terminates que detectes
   - Validaciones necesarias
   - Randomizaciones requeridas

---

## Formato de Respuesta

Proporciona:

1. **Codigo TXT completo** (listo para copiar a TextEdit e importar)
2. **Resumen**: Numero de bloques y preguntas
3. **Advertencias**: IDs que tuviste que acortar, tipos ambiguos, etc.
4. **Configuracion Manual Requerida**: Lista de lo que se debe hacer en Qualtrics despues de importar
`;
}

// ===========================================
// Post-Processing
// ===========================================

/**
 * Validate the generated TXT content
 */
export function validateTXTContent(content: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required header
  if (!content.includes("[[AdvancedFormat]]")) {
    errors.push("Falta [[AdvancedFormat]] al inicio");
  }

  // Check for duplicate IDs
  const idMatches = content.match(/\[\[ID:([^\]]+)\]\]/g) || [];
  const ids = idMatches.map((m) => m.replace(/\[\[ID:|]]/g, ""));
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length > 0) {
    errors.push(`IDs duplicados: ${Array.from(new Set(duplicates)).join(", ")}`);
  }

  // Check for IDs longer than 15 characters
  const longIds = ids.filter((id) => id.length > 15);
  if (longIds.length > 0) {
    errors.push(`IDs muy largos (>15 chars): ${longIds.join(", ")}`);
  }

  // Check for at least one block
  if (!content.includes("[[Block:")) {
    warnings.push("No se encontraron bloques definidos");
  }

  // Check for logic that shouldn't be in TXT
  const forbiddenPatterns = [
    { pattern: /display\s*logic/i, name: "Display Logic" },
    { pattern: /skip\s*to/i, name: "Skip Logic" },
    { pattern: /terminate/i, name: "Terminate Logic" },
  ];

  forbiddenPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(content)) {
      warnings.push(
        `Se detecto "${name}" en el contenido - debe configurarse manualmente`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Count questions and blocks in TXT content
 */
export function countTXTElements(content: string): {
  questions: number;
  blocks: number;
} {
  const questions = (content.match(/\[\[Question:/g) || []).length;
  const blocks = (content.match(/\[\[Block:/g) || []).length;
  return { questions, blocks };
}
