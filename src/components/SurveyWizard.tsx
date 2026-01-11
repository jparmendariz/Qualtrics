"use client";

import { useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileText,
  Edit3,
  RefreshCw,
  Download,
  FileType,
} from "lucide-react";

interface SurveyWizardProps {
  projectId: string;
  projectContext: {
    name?: string;
    client: string;
    methodology?: string;
    objectives?: string;
    description?: string;
    targetAudience?: string;
    sampleSize?: string;
    loi?: string;
  };
  onComplete: (finalContent: string) => void;
  onClose: () => void;
  onDownloadWord: (content: string) => void;
}

type WizardStep = "outline" | "blocks" | "complete";

interface SurveyBlock {
  id: string;
  title: string;
  content: string;
  approved: boolean;
}

export default function SurveyWizard({
  projectId,
  projectContext,
  onComplete,
  onClose,
  onDownloadWord,
}: SurveyWizardProps) {
  const [step, setStep] = useState<WizardStep>("outline");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Outline step
  const [surveyOutline, setSurveyOutline] = useState("");
  const [outlineApproved, setOutlineApproved] = useState(false);
  const [outlineFeedback, setOutlineFeedback] = useState(""); // Corrección 3: feedback para regenerar outline

  // Blocks step
  const [blocks, setBlocks] = useState<SurveyBlock[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [editingBlock, setEditingBlock] = useState(false);
  const [blockFeedback, setBlockFeedback] = useState("");
  const [lastQuestionNumber, setLastQuestionNumber] = useState(0); // Corrección 6: contador global de preguntas

  // Final survey content
  const [finalSurvey, setFinalSurvey] = useState("");

  // Generate survey outline
  const generateOutline = async (isRegeneration = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Corrección 3: incluir feedback para regeneración
      let prompt = `
Generate ONLY a survey flow outline showing the content blocks and topics to cover.

Format each block like this:
## Block N: [Block Title]
- Topic 1: Brief description
- Topic 2: Brief description
- ...

Do NOT include actual questions yet. Just the flow and structure.
Include 4-8 blocks covering: Screeners, Category Understanding, Brand Perceptions, Product Experience, Demographics, etc. as appropriate for the research objectives.
`;

      // Si es una regeneración con feedback, incluir el outline anterior y el feedback
      if (isRegeneration && outlineFeedback.trim()) {
        prompt = `
PREVIOUS SURVEY OUTLINE:
${surveyOutline}

USER FEEDBACK TO INCORPORATE:
${outlineFeedback}

Based on the feedback above, modify the previous outline. Only change what the user requested. Keep the same format:
## Block N: [Block Title]
- Topic 1: Brief description
- ...

Return the UPDATED outline.
`;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "survey-outline",
          projectContext,
          additionalPrompt: prompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error);

      setSurveyOutline(data.content);
      setOutlineFeedback(""); // Limpiar feedback después de regenerar
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating outline");
    } finally {
      setIsLoading(false);
    }
  };

  // Parse outline into blocks and generate questions for each
  const approveOutlineAndGenerateBlocks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse blocks from outline
      const blockMatches = surveyOutline.match(/##\s*Block\s*\d+[:\s]+([^\n]+)/gi) || [];
      const parsedBlocks: SurveyBlock[] = blockMatches.map((match, index) => {
        const title = match.replace(/##\s*Block\s*\d+[:\s]+/i, "").trim();
        // Extract block content from outline
        const blockRegex = new RegExp(`##\\s*Block\\s*${index + 1}[^#]+`, "i");
        const blockContent = surveyOutline.match(blockRegex)?.[0] || "";

        return {
          id: `block_${index + 1}`,
          title,
          content: "", // Will be filled with questions
          approved: false,
        };
      });

      if (parsedBlocks.length === 0) {
        // If no blocks found, create a default structure
        parsedBlocks.push(
          { id: "block_1", title: "Screeners", content: "", approved: false },
          { id: "block_2", title: "Main Questions", content: "", approved: false },
          { id: "block_3", title: "Demographics", content: "", approved: false }
        );
      }

      setBlocks(parsedBlocks);
      setOutlineApproved(true);

      // Generate questions for the first block
      await generateBlockQuestions(parsedBlocks, 0);

      setStep("blocks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing outline");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate questions for a specific block
  const generateBlockQuestions = async (currentBlocks: SurveyBlock[], blockIndex: number, hasFeedback = false) => {
    if (blockIndex >= currentBlocks.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const block = currentBlocks[blockIndex];

      // Corrección 6: calcular el número inicial de pregunta para este bloque
      const startingQuestionNumber = lastQuestionNumber + 1;

      let prompt = "";

      // Corrección 5: si hay feedback, hacer cambios incrementales en vez de regenerar todo
      if (hasFeedback && blockFeedback.trim() && block.content) {
        prompt = `
EXISTING questions for block "${block.title}":
${block.content}

USER FEEDBACK (apply these changes to the existing questions above):
${blockFeedback}

IMPORTANT: Only modify what the user requested. Keep everything else unchanged.
Return the MODIFIED version of the block with all questions included.

CRITICAL: Do NOT truncate or cut off questions. Complete ALL questions fully.
`;
      } else {
        prompt = `
Generate ONLY the questions for this specific block: "${block.title}"

Context from the survey outline:
${surveyOutline}

${blockIndex === 0 ? "Start numbering from Q1." : `Start numbering from Q${startingQuestionNumber}.`}

Generate 3-6 well-structured questions for this block only.
Use this format:
Q[N]. [Question ID]. [Question Type] [Question Text]
- Option 1
- Option 2
- etc.

Question types: [single select], [multi-select], [open-end], [scale 1-5], [matrix], etc.

CRITICAL INSTRUCTIONS:
- Complete ALL questions fully. Do NOT truncate or cut off any question.
- Include all answer options for each question.
- Ensure every question has a complete structure.
`;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "survey-design",
          projectContext,
          additionalPrompt: prompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error);

      const updatedBlocks = [...currentBlocks];
      updatedBlocks[blockIndex] = {
        ...block,
        content: data.content,
      };
      setBlocks(updatedBlocks);
      setBlockFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating block questions");
    } finally {
      setIsLoading(false);
    }
  };

  // Approve current block and move to next
  const approveBlock = async () => {
    const updatedBlocks = [...blocks];
    updatedBlocks[currentBlockIndex] = {
      ...updatedBlocks[currentBlockIndex],
      approved: true,
    };
    setBlocks(updatedBlocks);

    // Corrección 6: contar preguntas del bloque aprobado y actualizar el contador
    const blockContent = updatedBlocks[currentBlockIndex].content;
    const questionMatches = blockContent.match(/^Q\d+\./gm) || [];
    const questionsInBlock = questionMatches.length;
    const newLastQuestionNumber = lastQuestionNumber + questionsInBlock;
    setLastQuestionNumber(newLastQuestionNumber);

    if (currentBlockIndex < blocks.length - 1) {
      const nextIndex = currentBlockIndex + 1;
      setCurrentBlockIndex(nextIndex);

      // Generate questions for next block if not yet generated
      if (!updatedBlocks[nextIndex].content) {
        await generateBlockQuestions(updatedBlocks, nextIndex);
      }
    } else {
      // All blocks approved, compile final survey
      compileFinalSurvey(updatedBlocks);
    }
  };

  // Request changes to current block
  const requestBlockChanges = async () => {
    if (!blockFeedback.trim()) {
      setError("Por favor describe los cambios que necesitas");
      return;
    }
    // Corrección 5: pasar hasFeedback = true para hacer cambios incrementales
    await generateBlockQuestions(blocks, currentBlockIndex, true);
    setEditingBlock(false);
  };

  // Compile all approved blocks into final survey
  const compileFinalSurvey = (finalBlocks: SurveyBlock[]) => {
    const compiled = finalBlocks
      .map((block) => `\n## ${block.title}\n\n${block.content}`)
      .join("\n\n---\n");

    const header = `# Survey Questionnaire
Client: ${projectContext.client}
Project: ${projectContext.name || "Research Survey"}
Date: ${new Date().toLocaleDateString()}

---
`;

    setFinalSurvey(header + compiled);
    setStep("complete");
  };

  // Go back to previous block
  const goToPreviousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  // Render based on current step
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--gray-200)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--rx-500), #8b5cf6)" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--rx-600)" }}>
                Survey Design Wizard
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--gray-900)" }}>
                {step === "outline" && "Paso 1: Survey Flow"}
                {step === "blocks" && `Paso 2: Block ${currentBlockIndex + 1} of ${blocks.length}`}
                {step === "complete" && "Paso 3: Cuestionario Completo"}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-5 py-2" style={{ backgroundColor: "var(--gray-50)" }}>
          <div className="flex items-center gap-2">
            {["outline", "blocks", "complete"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor:
                      step === s ? "var(--rx-600)" : i < ["outline", "blocks", "complete"].indexOf(step) ? "var(--success)" : "var(--gray-200)",
                    color: step === s || i < ["outline", "blocks", "complete"].indexOf(step) ? "white" : "var(--gray-500)",
                  }}
                >
                  {i < ["outline", "blocks", "complete"].indexOf(step) ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && <div className="w-12 h-0.5" style={{ backgroundColor: "var(--gray-300)" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
              {error}
            </div>
          )}

          {/* STEP: Outline */}
          {step === "outline" && (
            <>
              {!surveyOutline && !isLoading && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--gray-300)" }} />
                  <h4 className="text-xl font-semibold mb-2" style={{ color: "var(--gray-700)" }}>
                    Comienza diseñando el flow de la encuesta
                  </h4>
                  <p className="mb-6" style={{ color: "var(--gray-500)" }}>
                    Primero generaremos un outline con los bloques y temas a cubrir. Luego iremos bloque por bloque creando las preguntas.
                  </p>
                  <button onClick={() => generateOutline()} className="btn-primary">
                    <Sparkles className="w-4 h-4" />
                    Generar Survey Flow
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: "var(--rx-600)" }} />
                  <p style={{ color: "var(--gray-600)" }}>Generando survey flow...</p>
                </div>
              )}

              {surveyOutline && !isLoading && (
                <div>
                  <div className="mb-4">
                    <label className="label">Survey Flow (revisa y aprueba o regenera)</label>
                    <div className="rounded-lg p-4 max-h-80 overflow-y-auto" style={{ backgroundColor: "var(--gray-50)" }}>
                      <pre className="whitespace-pre-wrap text-sm font-mono" style={{ color: "var(--gray-700)" }}>
                        {surveyOutline}
                      </pre>
                    </div>
                  </div>

                  {/* Corrección 3: Textarea para feedback cuando se regenera */}
                  <div className="mb-4">
                    <label className="label">¿Quieres hacer cambios? (opcional)</label>
                    <textarea
                      value={outlineFeedback}
                      onChange={(e) => setOutlineFeedback(e.target.value)}
                      placeholder="Describe los cambios que necesitas. Por ejemplo: 'Quita el bloque de demographics', 'Agrega un bloque de NPS', 'Divide el bloque de Brand en dos'..."
                      className="input"
                      rows={3}
                      style={{ resize: "vertical" }}
                    />
                    <p className="text-xs mt-1" style={{ color: "var(--gray-500)" }}>
                      Si dejas este campo vacío, se generará un outline completamente nuevo.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP: Blocks */}
          {step === "blocks" && blocks.length > 0 && (
            <>
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: "var(--rx-600)" }} />
                  <p style={{ color: "var(--gray-600)" }}>Generando preguntas para "{blocks[currentBlockIndex]?.title}"...</p>
                </div>
              ) : (
                <div>
                  {/* Block header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold" style={{ color: "var(--gray-800)" }}>
                      {blocks[currentBlockIndex]?.title}
                    </h4>
                    <div className="flex gap-2">
                      {blocks.map((block, i) => (
                        <div
                          key={block.id}
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: block.approved ? "var(--success)" : i === currentBlockIndex ? "var(--rx-600)" : "var(--gray-300)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Block content */}
                  <div className="rounded-lg p-4 max-h-80 overflow-y-auto mb-4" style={{ backgroundColor: "var(--gray-50)" }}>
                    <pre className="whitespace-pre-wrap text-sm font-mono" style={{ color: "var(--gray-700)" }}>
                      {blocks[currentBlockIndex]?.content || "Generando..."}
                    </pre>
                  </div>

                  {/* Edit feedback */}
                  {editingBlock && (
                    <div className="mb-4">
                      <label className="label">¿Qué cambios necesitas?</label>
                      <textarea
                        value={blockFeedback}
                        onChange={(e) => setBlockFeedback(e.target.value)}
                        placeholder="Describe los cambios que quieres hacer a este bloque..."
                        className="input"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* STEP: Complete */}
          {step === "complete" && (
            <div>
              <div className="text-center mb-6">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--success)" }} />
                <h4 className="text-xl font-semibold mb-2" style={{ color: "var(--gray-800)" }}>
                  ¡Cuestionario Completado!
                </h4>
                <p style={{ color: "var(--gray-500)" }}>Todos los bloques han sido aprobados. Revisa el cuestionario final.</p>
              </div>

              <div className="rounded-lg p-4 max-h-96 overflow-y-auto mb-4" style={{ backgroundColor: "var(--gray-50)" }}>
                <pre className="whitespace-pre-wrap text-sm font-mono" style={{ color: "var(--gray-700)" }}>
                  {finalSurvey}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 flex items-center justify-between" style={{ borderTop: "1px solid var(--gray-200)" }}>
          <button onClick={onClose} className="btn-ghost">
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {/* Outline step actions */}
            {step === "outline" && surveyOutline && !isLoading && (
              <>
                <button onClick={() => generateOutline(true)} className="btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                  {outlineFeedback.trim() ? "Aplicar Cambios" : "Regenerar"}
                </button>
                <button onClick={approveOutlineAndGenerateBlocks} className="btn-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  Aprobar y Continuar
                </button>
              </>
            )}

            {/* Blocks step actions */}
            {step === "blocks" && !isLoading && (
              <>
                {currentBlockIndex > 0 && (
                  <button onClick={goToPreviousBlock} className="btn-secondary">
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </button>
                )}
                {!editingBlock ? (
                  <>
                    <button onClick={() => setEditingBlock(true)} className="btn-secondary">
                      <Edit3 className="w-4 h-4" />
                      Pedir Cambios
                    </button>
                    <button onClick={approveBlock} className="btn-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      {currentBlockIndex < blocks.length - 1 ? "Aprobar y Siguiente" : "Aprobar y Finalizar"}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingBlock(false)} className="btn-secondary">
                      Cancelar
                    </button>
                    <button onClick={requestBlockChanges} className="btn-primary">
                      <RefreshCw className="w-4 h-4" />
                      Aplicar Cambios
                    </button>
                  </>
                )}
              </>
            )}

            {/* Complete step actions */}
            {step === "complete" && (
              <>
                <button onClick={() => onDownloadWord(finalSurvey)} className="btn-secondary" style={{ backgroundColor: "var(--info)", color: "white" }}>
                  <FileType className="w-4 h-4" />
                  Descargar Word
                </button>
                <button onClick={() => onComplete(finalSurvey)} className="btn-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  Guardar y Completar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
