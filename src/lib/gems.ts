// Gemini Gems URLs for each automation task
// These open the pre-configured Gems in Gemini

export const GEMS = {
  // Phase 5: Programming & QC
  programming: {
    name: "Survey Programming Builder",
    url: "https://gemini.google.com/gem/1OYUqTjENJVyhoM5R5ooz1FC_l-m0N57V",
    description: "Convierte el cuestionario a formato TXT de Qualtrics",
  },

  // Phase 4: Briefing & Design
  surveyDesign: {
    name: "Survey Design Builder",
    url: "", // TODO: Add URL
    description: "Diseña la encuesta basada en el brief",
  },

  // Phase 1: Pre-Kickoff
  dossier: {
    name: "Context Dossier Generator",
    url: "", // TODO: Add URL
    description: "Genera el dossier de contexto del proyecto",
  },

  // Phase 3: Kick Off Meeting
  koDeck: {
    name: "Kick Off Deck Generator",
    url: "", // TODO: Add URL
    description: "Genera la presentación de Kick Off",
  },

  // Phase 7: Analysis Plan
  analysisPlan: {
    name: "Analysis Plan Builder",
    url: "", // TODO: Add URL
    description: "Genera el plan de análisis",
  },

  // Phase 8: Analysis & Insights
  insights: {
    name: "Insights Generator",
    url: "", // TODO: Add URL
    description: "Genera key findings e insights",
  },
} as const;

// Type for Gem keys
export type GemKey = keyof typeof GEMS;

// Helper to open a Gem in a new tab
export function openGem(gemKey: keyof typeof GEMS): boolean {
  const gem = GEMS[gemKey];
  if (gem.url) {
    window.open(gem.url, "_blank");
    return true;
  }
  return false;
}

// Check if a Gem is configured
export function isGemConfigured(gemKey: keyof typeof GEMS): boolean {
  return Boolean(GEMS[gemKey]?.url);
}
