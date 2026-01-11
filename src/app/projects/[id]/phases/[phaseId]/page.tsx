"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Play,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
  Copy,
  Download,
  Save,
  FileText,
} from "lucide-react";
import {
  useProjectsStore,
  PHASES,
  getIncludedPhases,
  ACTION_DESCRIPTIONS,
  type Project,
  type ActionTrigger,
  type PhaseId,
} from "@/lib/store/projects";
import { useAuthStore } from "@/lib/store/auth";
import SurveyWizard from "@/components/SurveyWizard";

// Task configuration
const TASKS_REQUIRING_INPUT: Record<string, {
  type: "text" | "file" | "both";
  label: string;
  placeholder: string;
  fileTypes?: string;
  contextFrom?: ActionTrigger[];
  multipleFiles?: boolean;
}> = {
  transcription_processed: {
    type: "both",
    label: "Transcripcion y Notas del Proyecto",
    placeholder: "Pega aqui la transcripcion del meeting, notas relevantes, contexto adicional del proyecto...",
    fileTypes: ".docx,.doc,.pdf,.txt,.rtf",
    multipleFiles: true,
    contextFrom: ["dossier_generated"],
  },
  research_brief_created: {
    type: "text",
    label: "Notas adicionales para el Brief",
    placeholder: "Agrega notas del kick-off, objetivos especificos, o contexto adicional...",
    contextFrom: ["transcription_processed", "dossier_generated"],
  },
  survey_designed: {
    type: "text",
    label: "Documento de cuestionario o guia de discusion",
    placeholder: "Pega el cuestionario existente o guia de preguntas...",
    contextFrom: ["research_brief_created"],
  },
  txt_generated: {
    type: "both",
    label: "Cuestionario aprobado para convertir a TXT",
    placeholder: "Pega el cuestionario aprobado o sube el archivo Word del survey...",
    fileTypes: ".docx,.doc,.txt",
    contextFrom: ["survey_designed"],
  },
  programming_qc_done: {
    type: "text",
    label: "Codigo TXT a revisar",
    placeholder: "Pega el codigo TXT de Qualtrics para revision de QC...",
    contextFrom: ["txt_generated"],
  },
  soft_launch_analyzed: {
    type: "both",
    label: "Datos del Soft Launch",
    placeholder: "Pega los datos del soft launch o descripcion de las metricas...",
    fileTypes: ".csv,.xlsx,.xls",
  },
  oe_coded: {
    type: "both",
    label: "Respuestas abiertas a codificar",
    placeholder: "Pega las respuestas abiertas (una por linea o en formato tabla)...",
    fileTypes: ".csv,.xlsx,.xls,.txt",
  },
  analysis_plan_created: {
    type: "text",
    label: "Objetivos y preguntas para el plan de analisis",
    placeholder: "Describe los objetivos de analisis, variables clave, y preguntas a responder...",
    contextFrom: ["research_brief_created"],
  },
  insights_generated: {
    type: "both",
    label: "Datos o crosstabs para generar insights",
    placeholder: "Pega los hallazgos clave, datos destacados, o descripcion de resultados...",
    fileTypes: ".csv,.xlsx,.xls,.pptx",
    contextFrom: ["dossier_generated", "research_brief_created", "analysis_plan_created"],
  },
  report_qc_validated: {
    type: "text",
    label: "Contenido del reporte y crosstabs para validar",
    placeholder: "Pega el contenido del reporte (slides) y los datos de crosstabs correspondientes...",
    contextFrom: ["insights_generated"],
  },
};

const ACTION_TO_TASK_TYPE: Partial<Record<ActionTrigger, string>> = {
  dossier_generated: "dossier",
  ko_deck_generated: "ko-deck",
  transcription_processed: "transcription-processing",
  research_brief_created: "research-brief",
  survey_designed: "survey-design",
  txt_generated: "txt-generation",
  programming_qc_done: "programming-qc",
  soft_launch_analyzed: "soft-launch-analysis",
  oe_coded: "oe-coding",
  analysis_plan_created: "analysis-plan",
  insights_generated: "insights-report",
  report_qc_validated: "report-qc",
};

const PHASE_ACTIONS: Record<PhaseId, { trigger: ActionTrigger; label: string; description: string }[]> = {
  "pre-kickoff": [
    { trigger: "dossier_generated", label: "Generar Dossier Completo", description: "Crear dossier con contexto del cliente, industria y contactos" },
    { trigger: "context_research_done", label: "Investigacion Completa", description: "Marcar investigacion como completada" },
  ],
  "kickoff-meeting": [
    { trigger: "ko_deck_generated", label: "Generar KO Deck", description: "Crear presentacion con AI" },
    { trigger: "transcription_processed", label: "Procesar Transcripcion", description: "Subir transcripcion y extraer puntos clave" },
    { trigger: "ko_meeting_done", label: "Meeting Completado", description: "Marcar kick-off como realizado" },
  ],
  "briefing-design": [
    { trigger: "research_brief_created", label: "Generar Research Brief", description: "Crear brief con AI" },
    { trigger: "brief_created", label: "Brief Aprobado", description: "Marcar brief como aprobado por cliente" },
    { trigger: "survey_designed", label: "Disenar Encuesta", description: "Crear diseno de cuestionario con AI" },
    { trigger: "questionnaire_approved", label: "Cuestionario Aprobado", description: "Aprobar cuestionario final" },
  ],
  "programming-qc": [
    { trigger: "txt_generated", label: "Generar TXT", description: "Convertir cuestionario a formato TXT" },
    { trigger: "programming_qc_done", label: "QC de Programacion", description: "Revisar TXT con AI" },
    { trigger: "survey_programmed", label: "Survey Programado", description: "Marcar como programado en Qualtrics" },
    { trigger: "qc_passed", label: "QC Aprobado", description: "Aprobar QC de programacion" },
  ],
  "launch-monitoring": [
    { trigger: "soft_launch_done", label: "Soft Launch", description: "Completar soft launch" },
    { trigger: "soft_launch_analyzed", label: "Analizar Soft Launch", description: "Subir datos y auditar con AI" },
    { trigger: "full_launch_done", label: "Full Launch", description: "Lanzar fieldwork completo" },
    { trigger: "oe_coded", label: "Codificar Open-Ends", description: "Subir respuestas y categorizar con AI" },
    { trigger: "fieldwork_complete", label: "Fieldwork Completo", description: "Cerrar recoleccion de datos" },
  ],
  "analysis-plan": [
    { trigger: "analysis_plan_created", label: "Crear Plan de Analisis", description: "Generar plan con AI" },
    { trigger: "data_cuts_defined", label: "Definir Data Cuts", description: "Documentar cortes de datos" },
  ],
  "analysis-insights": [
    { trigger: "insights_generated", label: "Generar Insights", description: "Subir datos y crear findings con AI" },
    { trigger: "report_drafted", label: "Borrador Completo", description: "Completar borrador de reporte" },
  ],
  "report-qc": [
    { trigger: "report_qc_validated", label: "Validar vs Crosstabs", description: "Subir reporte y verificar con AI" },
    { trigger: "report_qc_passed", label: "QC Aprobado", description: "Aprobar QC final del reporte" },
    { trigger: "report_delivered", label: "Reporte Entregado", description: "Entregar al cliente" },
  ],
};

export default function PhaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const phaseId = params.phaseId as PhaseId;

  const {
    getProject,
    completeAction,
    uncompleteAction,
    saveGemOutput,
    getGemOutput,
    saveUserInput,
    getUserInput,
    advancePhase,
  } = useProjectsStore();
  const { currentUser } = useAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [showSurveyWizard, setShowSurveyWizard] = useState(false);
  const [inputModal, setInputModal] = useState<{
    trigger: ActionTrigger;
    label: string;
    taskType: string;
    config: typeof TASKS_REQUIRING_INPUT[string];
  } | null>(null);
  const [userInput, setUserInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [viewOutputModal, setViewOutputModal] = useState<{ trigger: ActionTrigger; content: string } | null>(null);

  // Refresh project
  useEffect(() => {
    const p = getProject(projectId);
    if (p) setProject(p);
  }, [projectId, getProject]);

  useEffect(() => {
    const interval = setInterval(() => {
      const p = getProject(projectId);
      if (p) setProject(p);
    }, 1000);
    return () => clearInterval(interval);
  }, [projectId, getProject]);

  if (!project) return null;

  const phase = PHASES.find((p) => p.id === phaseId);
  const includedPhaseIds = getIncludedPhases(project);
  const includedPhases = PHASES.filter((p) => includedPhaseIds.includes(p.id));
  const phaseActions = PHASE_ACTIONS[phaseId] || [];
  const completedTriggers = project.completedActions.map((a) => a.trigger);

  const currentPhaseIndex = includedPhases.findIndex((p) => p.id === phaseId);
  const prevPhase = currentPhaseIndex > 0 ? includedPhases[currentPhaseIndex - 1] : null;
  const nextPhase = currentPhaseIndex < includedPhases.length - 1 ? includedPhases[currentPhaseIndex + 1] : null;

  const handleActionClick = async (trigger: ActionTrigger) => {
    const taskType = ACTION_TO_TASK_TYPE[trigger];
    const inputConfig = TASKS_REQUIRING_INPUT[trigger];

    // Special case: Survey Wizard
    if (trigger === "survey_designed") {
      setShowSurveyWizard(true);
      return;
    }

    // If needs input, show modal
    if (inputConfig) {
      setInputModal({
        trigger,
        label: inputConfig.label,
        taskType: taskType || "",
        config: inputConfig,
      });
      setUserInput("");
      setUploadedFiles([]);
      setGeneratedContent(null);
      return;
    }

    // If AI task without input, generate directly
    if (taskType) {
      setIsGenerating(true);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskType,
            projectContext: {
              name: project.projectName || project.oppName,
              client: project.clientName,
              methodology: project.methodology,
              objectives: project.objectives,
              targetAudience: project.targetAudience,
              sampleSize: project.sampleSize,
              loi: project.loi,
            },
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        saveGemOutput(projectId, trigger, data.content);
        completeAction(projectId, trigger, `Generado con AI`, currentUser?.name);
      } catch (error) {
        console.error("Generation error:", error);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Manual action - toggle completion
    if (completedTriggers.includes(trigger)) {
      uncompleteAction(projectId, trigger);
    } else {
      completeAction(projectId, trigger, ACTION_DESCRIPTIONS[trigger] || "Completado", currentUser?.name);
    }
  };

  const handleGenerate = async () => {
    if (!inputModal) return;

    setIsGenerating(true);
    try {
      let additionalContext = "";
      if (inputModal.config.contextFrom) {
        for (const prevTrigger of inputModal.config.contextFrom) {
          const prevOutput = getGemOutput(projectId, prevTrigger);
          if (prevOutput) {
            additionalContext += `\n\n--- Previous: ${prevTrigger} ---\n${prevOutput.output}`;
          }
        }
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: inputModal.taskType,
          projectContext: {
            name: project.projectName || project.oppName,
            client: project.clientName,
            methodology: project.methodology,
            objectives: project.objectives,
            targetAudience: project.targetAudience,
            sampleSize: project.sampleSize,
            loi: project.loi,
          },
          additionalPrompt: userInput + additionalContext,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setGeneratedContent(data.content);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveOutput = () => {
    if (!inputModal || !generatedContent) return;

    saveGemOutput(projectId, inputModal.trigger, generatedContent);
    saveUserInput(projectId, inputModal.trigger, {
      text: userInput,
      fileName: uploadedFiles.map((f) => f.name).join(", "),
    });
    completeAction(projectId, inputModal.trigger, "Generado con AI", currentUser?.name);
    setInputModal(null);
    setGeneratedContent(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Phase Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {phase?.number}. {phase?.name}
          </h2>
          <p className="text-gray-500 mt-1">{phase?.description}</p>
        </div>

        {/* Phase Navigation */}
        <div className="flex items-center gap-2">
          {prevPhase && (
            <Link
              href={`/projects/${projectId}/phases/${prevPhase.id}`}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {prevPhase.name}
            </Link>
          )}
          {nextPhase && (
            <Link
              href={`/projects/${projectId}/phases/${nextPhase.id}`}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {nextPhase.name}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {phaseActions.map((action) => {
            const isCompleted = completedTriggers.includes(action.trigger);
            const hasOutput = project.gemOutputs?.some((o) => o.trigger === action.trigger);
            const isAITask = !!ACTION_TO_TASK_TYPE[action.trigger];

            return (
              <div
                key={action.trigger}
                className={`p-4 flex items-center gap-4 ${
                  isCompleted ? "bg-green-50/50" : ""
                }`}
              >
                {/* Action Button */}
                <button
                  onClick={() => handleActionClick(action.trigger)}
                  disabled={isGenerating}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isAITask
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isAITask ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{action.label}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>

                {/* View Output */}
                {isCompleted && hasOutput && (
                  <button
                    onClick={() => {
                      const output = getGemOutput(projectId, action.trigger);
                      if (output) {
                        setViewOutputModal({ trigger: action.trigger, content: output.output });
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Modal */}
      {inputModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{inputModal.label}</h3>
              <button
                onClick={() => setInputModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!generatedContent ? (
                <>
                  {/* Text Input */}
                  {(inputModal.config.type === "text" || inputModal.config.type === "both") && (
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={inputModal.config.placeholder}
                      className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  )}

                  {/* File Upload */}
                  {(inputModal.config.type === "file" || inputModal.config.type === "both") && (
                    <div className="mt-4">
                      <label className="block p-8 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Arrastra archivos o haz clic para subir
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {inputModal.config.fileTypes}
                        </p>
                        <input
                          type="file"
                          accept={inputModal.config.fileTypes}
                          multiple={inputModal.config.multipleFiles}
                          onChange={(e) => {
                            if (e.target.files) {
                              setUploadedFiles(Array.from(e.target.files));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {uploadedFiles.map((file, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                            >
                              <FileText className="w-3 h-3" />
                              {file.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Generated Content Preview */
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-xl text-sm">
                    {generatedContent}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              {!generatedContent ? (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || (!userInput && uploadedFiles.length === 0)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generar
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setGeneratedContent(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Regenerar
                  </button>
                  <button
                    onClick={() => copyToClipboard(generatedContent)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button
                    onClick={handleSaveOutput}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Output Modal */}
      {viewOutputModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Output: {viewOutputModal.trigger}</h3>
              <button
                onClick={() => setViewOutputModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-xl text-sm">
                {viewOutputModal.content}
              </pre>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => copyToClipboard(viewOutputModal.content)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Survey Wizard */}
      {showSurveyWizard && (
        <SurveyWizard
          projectId={projectId}
          projectContext={{
            name: project.projectName || project.oppName,
            client: project.clientName,
            methodology: project.methodology,
            objectives: project.objectives,
            targetAudience: project.targetAudience,
            sampleSize: project.sampleSize,
            loi: project.loi,
          }}
          onComplete={(content) => {
            saveGemOutput(projectId, "survey_designed", content);
            completeAction(projectId, "survey_designed", "Diseno creado con Survey Wizard", currentUser?.name);
            setShowSurveyWizard(false);
          }}
          onClose={() => setShowSurveyWizard(false)}
          onDownloadWord={async (content) => {
            // TODO: Implement word download
            console.log("Download word", content);
          }}
        />
      )}
    </div>
  );
}
