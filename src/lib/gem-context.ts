// Context generators for each Gem type
// These generate the context that gets copied to clipboard before opening a Gem

import { Project, ActionTrigger } from "./store/projects";
import { GemKey } from "./gems";

// Mapping from action triggers to Gem keys (duplicated from page for utility use)
export const ACTION_TO_GEM: Partial<Record<ActionTrigger, GemKey>> = {
  dossier_generated: "dossier",
  ko_deck_generated: "koDeck",
  survey_designed: "surveyDesign",
  txt_generated: "programming",
  analysis_plan_created: "analysisPlan",
  insights_generated: "insights",
};

interface GemContext {
  title: string;
  instructions: string;
  context: string;
}

// Generate context for the Dossier Gem (Phase 1)
function generateDossierContext(project: Project): GemContext {
  return {
    title: "Contexto para Dossier",
    instructions: "Pega este contexto en el Gem y pide que genere el dossier de contexto.",
    context: `
=== PROYECTO ===
Cliente: ${project.clientName}
Nombre del Proyecto: ${project.projectName}
Oportunidad: ${project.oppName}
Research Manager: ${project.researchManager}

=== ESPECIFICACIONES ===
${project.sampleSize ? `Sample Size: N = ${project.sampleSize}` : "Sample Size: Por definir"}
${project.incidenceRate ? `Incidence Rate: ${project.incidenceRate}` : ""}
${project.loi ? `LOI: ${project.loi} minutos` : ""}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ""}
${project.totalCost ? `Costo Total: USD ${project.totalCost}` : ""}

=== INSTRUCCIONES ===
Por favor genera un dossier de contexto para este proyecto de investigacion.
Incluye: industria del cliente, competidores, contexto del mercado, y cualquier informacion relevante.
`.trim(),
  };
}

// Generate context for the KO Deck Gem (Phase 3)
function generateKODeckContext(project: Project): GemContext {
  const dossier = project.dossier || "No hay dossier disponible";

  return {
    title: "Contexto para KO Deck",
    instructions: "Pega este contexto en el Gem y pide que genere la presentacion de Kick Off.",
    context: `
=== PROYECTO ===
Cliente: ${project.clientName}
Nombre del Proyecto: ${project.projectName}
Oportunidad: ${project.oppName}
Research Manager: ${project.researchManager}

=== ESPECIFICACIONES ===
${project.sampleSize ? `Sample Size: N = ${project.sampleSize}` : "Sample Size: Por definir"}
${project.incidenceRate ? `Incidence Rate: ${project.incidenceRate}` : ""}
${project.loi ? `LOI: ${project.loi} minutos` : ""}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ""}
${project.totalCost ? `Costo Total: USD ${project.totalCost}` : ""}

=== DOSSIER DE CONTEXTO ===
${dossier}

=== INSTRUCCIONES ===
Por favor genera una presentacion de Kick Off Meeting para este proyecto.
Incluye: objetivos del estudio, metodologia, timeline, equipo, y proximos pasos.
`.trim(),
  };
}

// Generate context for the Survey Design Gem (Phase 4)
function generateSurveyDesignContext(project: Project): GemContext {
  // Get previous gem outputs if available
  const gemOutputs = project.gemOutputs || [];
  const dossierOutput = gemOutputs.find((o) => o.trigger === "dossier_generated")?.output || "";

  return {
    title: "Contexto para Diseno de Encuesta",
    instructions: "Pega este contexto en el Gem y pide que disene la encuesta.",
    context: `
=== PROYECTO ===
Cliente: ${project.clientName}
Nombre del Proyecto: ${project.projectName}
Research Manager: ${project.researchManager}

=== ESPECIFICACIONES ===
${project.sampleSize ? `Sample Size: N = ${project.sampleSize}` : "Sample Size: Por definir"}
${project.incidenceRate ? `Incidence Rate: ${project.incidenceRate}` : ""}
${project.loi ? `LOI: ${project.loi} minutos` : ""}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ""}

${dossierOutput ? `=== DOSSIER PREVIO ===\n${dossierOutput}\n` : ""}

=== INSTRUCCIONES ===
Por favor disena una encuesta para este proyecto de investigacion.
Considera el LOI objetivo y el target audience.
Incluye: screener, preguntas principales, demograficos.
`.trim(),
  };
}

// Generate context for the Programming Gem (Phase 5)
function generateProgrammingContext(project: Project): GemContext {
  // Get previous gem outputs
  const gemOutputs = project.gemOutputs || [];
  const surveyDesignOutput = gemOutputs.find((o) => o.trigger === "survey_designed")?.output || "";

  return {
    title: "Contexto para Programming TXT",
    instructions: "Pega este contexto en el Gem para convertir el cuestionario a formato TXT de Qualtrics.",
    context: `
=== PROYECTO ===
Cliente: ${project.clientName}
Nombre del Proyecto: ${project.projectName}

=== ESPECIFICACIONES ===
${project.loi ? `LOI Target: ${project.loi} minutos` : ""}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ""}

${surveyDesignOutput ? `=== DISENO DE ENCUESTA ===\n${surveyDesignOutput}\n` : ""}

=== INSTRUCCIONES ===
Por favor convierte este cuestionario a formato TXT compatible con Qualtrics.
Usa la sintaxis correcta de Qualtrics para cada tipo de pregunta.
`.trim(),
  };
}

// Generate context for the Analysis Plan Gem (Phase 7)
function generateAnalysisPlanContext(project: Project): GemContext {
  const gemOutputs = project.gemOutputs || [];
  const surveyOutput = gemOutputs.find((o) => o.trigger === "survey_designed")?.output || "";

  return {
    title: "Contexto para Plan de Analisis",
    instructions: "Pega este contexto en el Gem para generar el plan de analisis.",
    context: `
=== PROYECTO ===
Cliente: ${project.clientName}
Nombre del Proyecto: ${project.projectName}
Research Manager: ${project.researchManager}

=== ESPECIFICACIONES ===
${project.sampleSize ? `Sample Size: N = ${project.sampleSize}` : ""}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ""}

${surveyOutput ? `=== ENCUESTA ===\n${surveyOutput}\n` : ""}

=== INSTRUCCIONES ===
Por favor genera un plan de analisis para este estudio.
Incluye: variables clave, cruces principales, pruebas estadisticas sugeridas.
`.trim(),
  };
}

// Generate context for the Insights Gem (Phase 8)
function generateInsightsContext(project: Project): GemContext {
  const gemOutputs = project.gemOutputs || [];
  const analysisOutput = gemOutputs.find((o) => o.trigger === "analysis_plan_created")?.output || "";

  return {
    title: "Contexto para Insights",
    instructions: "Pega este contexto en el Gem junto con los datos del estudio para generar insights.",
    context: `
=== PROYECTO ===
Cliente: ${project.clientName}
Nombre del Proyecto: ${project.projectName}
Research Manager: ${project.researchManager}

=== ESPECIFICACIONES ===
${project.sampleSize ? `Sample Size: N = ${project.sampleSize}` : ""}
${project.targetAudience ? `Target Audience: ${project.targetAudience}` : ""}

${analysisOutput ? `=== PLAN DE ANALISIS ===\n${analysisOutput}\n` : ""}

=== INSTRUCCIONES ===
Por favor genera key findings e insights basados en los datos del estudio.
Pega los datos/tablas del estudio a continuacion de este contexto.
`.trim(),
  };
}

// Main function to generate context based on action trigger
export function generateGemContext(project: Project, trigger: ActionTrigger): GemContext | null {
  switch (trigger) {
    case "dossier_generated":
      return generateDossierContext(project);
    case "ko_deck_generated":
      return generateKODeckContext(project);
    case "survey_designed":
      return generateSurveyDesignContext(project);
    case "txt_generated":
      return generateProgrammingContext(project);
    case "analysis_plan_created":
      return generateAnalysisPlanContext(project);
    case "insights_generated":
      return generateInsightsContext(project);
    default:
      return null;
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
