import { create } from "zustand";
import { persist } from "zustand/middleware";

// Phase definitions with their triggers
export const PHASES = [
  {
    id: "pre-kickoff",
    number: 1,
    name: "Pre-Kick Off",
    description: "Dossier de contexto",
    triggers: ["dossier_generated", "context_research_done"],
  },
  {
    id: "kickoff-meeting",
    number: 2,
    name: "Kick Off Meeting",
    description: "Presentacion y transcripcion",
    triggers: ["ko_deck_generated", "transcription_processed", "ko_meeting_done"],
  },
  {
    id: "briefing-design",
    number: 3,
    name: "Briefing & Design",
    description: "Brief y encuesta",
    triggers: ["research_brief_created", "brief_created", "survey_designed", "questionnaire_approved"],
  },
  {
    id: "programming-qc",
    number: 4,
    name: "Programming & QC",
    description: "Codigo TXT y QC",
    triggers: ["txt_generated", "programming_qc_done", "survey_programmed", "qc_passed"],
  },
  {
    id: "launch-monitoring",
    number: 5,
    name: "Launch & Monitor",
    description: "Soft launch y fieldwork",
    triggers: ["soft_launch_done", "soft_launch_analyzed", "full_launch_done", "fieldwork_complete", "oe_coded"],
  },
  {
    id: "analysis-plan",
    number: 6,
    name: "Analysis Plan",
    description: "Plan de analisis",
    triggers: ["analysis_plan_created", "data_cuts_defined"],
  },
  {
    id: "analysis-insights",
    number: 7,
    name: "Analysis & Insights",
    description: "Key findings",
    triggers: ["insights_generated", "report_drafted"],
  },
  {
    id: "report-qc",
    number: 8,
    name: "Report QC",
    description: "Validacion final",
    triggers: ["report_qc_validated", "report_qc_passed", "report_delivered"],
  },
] as const;

export type PhaseId = (typeof PHASES)[number]["id"];
export type ActionTrigger = (typeof PHASES)[number]["triggers"][number];

export interface ProjectAction {
  id: string;
  trigger: ActionTrigger;
  description: string;
  completedAt: string;
  completedBy?: string;
}

export interface GemOutput {
  trigger: ActionTrigger;
  output: string;
  savedAt: string;
  savedBy?: string;
}

export interface Project {
  id: string;
  oppName: string;
  clientName: string;
  projectName: string;
  researchManager: string;
  currentPhase: PhaseId;
  phaseNumber: number;
  status: "active" | "completed" | "on-hold" | "cancelled";
  totalCost?: string;
  sampleSize?: string;
  incidenceRate?: string;
  loi?: string;
  targetAudience?: string;
  methodology?: string;
  objectives?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completedActions: ProjectAction[];
  gemOutputs: GemOutput[];
  dossier?: string;
  notes?: string;
  // Phases included in this project (explicit selection by user)
  includedPhases?: PhaseId[];
  // Legacy: Services from DocuSign
  serviceType?: string; // "Full Service", "Sample Only", "Reporting", etc.
  servicesIncluded?: string[];
  // Quotas and screeners from DocuSign
  quotas?: string[];
  screeners?: string[];
  sampleType?: string;
  assumptions?: string;
  // Client contacts for research
  clientContacts?: {
    name: string;
    email: string;
    role?: string;
  }[];

  // User inputs for AI tasks (stored per trigger)
  userInputs?: {
    [key: string]: {
      text?: string;
      fileName?: string;
      fileData?: string;
      savedAt: string;
    };
  };
}

// Service type to phases mapping
// Determines which phases are available based on contracted service
export const SERVICE_PHASE_MAPPING: Record<string, PhaseId[]> = {
  // Full Service = all phases
  "full service": [
    "pre-kickoff", "kickoff-meeting", "briefing-design",
    "programming-qc", "launch-monitoring", "analysis-plan", "analysis-insights", "report-qc"
  ],
  // Sample Only = up to launch, no analysis or reporting
  "sample only": [
    "pre-kickoff", "kickoff-meeting", "briefing-design",
    "programming-qc", "launch-monitoring"
  ],
  // Reporting only = analysis and report phases
  "reporting": [
    "analysis-plan", "analysis-insights", "report-qc"
  ],
  // Data processing = up to analysis plan
  "data processing": [
    "pre-kickoff", "kickoff-meeting", "briefing-design",
    "programming-qc", "launch-monitoring", "analysis-plan"
  ],
};

// Helper to get included phases for a project
export function getIncludedPhases(project: Project): PhaseId[] {
  // First, check if includedPhases is explicitly set
  if (project.includedPhases && project.includedPhases.length > 0) {
    return project.includedPhases;
  }

  // Legacy fallback: check serviceType mapping
  if (!project.serviceType) {
    // Default to all phases if no service type specified
    return PHASES.map(p => p.id);
  }

  const serviceKey = project.serviceType.toLowerCase();

  // Check for exact match first
  if (SERVICE_PHASE_MAPPING[serviceKey]) {
    return SERVICE_PHASE_MAPPING[serviceKey];
  }

  // Check for partial matches
  for (const [key, phases] of Object.entries(SERVICE_PHASE_MAPPING)) {
    if (serviceKey.includes(key) || key.includes(serviceKey)) {
      return phases;
    }
  }

  // Default to all phases
  return PHASES.map(p => p.id);
}

interface ProjectsState {
  projects: Project[];

  // Actions
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "completedActions" | "gemOutputs" | "phaseNumber">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Phase management
  completeAction: (projectId: string, trigger: ActionTrigger, description: string, completedBy?: string) => void;
  uncompleteAction: (projectId: string, trigger: ActionTrigger) => void;
  advancePhase: (projectId: string) => void;
  setPhase: (projectId: string, phaseId: PhaseId) => void;

  // Gem outputs
  saveGemOutput: (projectId: string, trigger: ActionTrigger, output: string, savedBy?: string) => void;
  getGemOutput: (projectId: string, trigger: ActionTrigger) => GemOutput | undefined;

  // User inputs
  saveUserInput: (projectId: string, trigger: string, input: { text?: string; fileName?: string; fileData?: string }) => void;
  getUserInput: (projectId: string, trigger: string) => { text?: string; fileName?: string; fileData?: string; savedAt: string } | undefined;

  // Queries
  getProject: (id: string) => Project | undefined;
  getProjectsByRM: (rmName: string) => Project[];
  getProjectsByPhase: (phaseId: PhaseId) => Project[];
  getActiveProjects: () => Project[];
}

// Helper to determine if phase should advance
function shouldAdvancePhase(project: Project): boolean {
  const currentPhaseConfig = PHASES.find((p) => p.id === project.currentPhase);
  if (!currentPhaseConfig) return false;

  const completedTriggers = project.completedActions.map((a) => a.trigger);

  // Check if at least one trigger for current phase is completed
  const hasCompletedCurrentPhase = currentPhaseConfig.triggers.some((t) =>
    completedTriggers.includes(t as ActionTrigger)
  );

  return hasCompletedCurrentPhase;
}

// Helper to get next phase
function getNextPhase(currentPhaseId: PhaseId): PhaseId | null {
  const currentIndex = PHASES.findIndex((p) => p.id === currentPhaseId);
  if (currentIndex === -1 || currentIndex >= PHASES.length - 1) return null;
  return PHASES[currentIndex + 1].id;
}

// Helper to get phase number
function getPhaseNumber(phaseId: PhaseId): number {
  const phase = PHASES.find((p) => p.id === phaseId);
  return phase?.number || 1;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          currentPhase: projectData.currentPhase || "pre-kickoff",
          phaseNumber: getPhaseNumber(projectData.currentPhase || "pre-kickoff"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedActions: [],
          gemOutputs: [],
        };

        set((state) => ({
          projects: [...state.projects, newProject],
        }));

        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      completeAction: (projectId, trigger, description, completedBy) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;

        // Check if action already completed
        if (project.completedActions.some((a) => a.trigger === trigger)) {
          return;
        }

        const newAction: ProjectAction = {
          id: `action_${Date.now()}`,
          trigger,
          description,
          completedAt: new Date().toISOString(),
          completedBy,
        };

        // Add action
        const updatedProject: Project = {
          ...project,
          completedActions: [...project.completedActions, newAction],
          updatedAt: new Date().toISOString(),
        };

        // Check if should auto-advance phase
        if (shouldAdvancePhase(updatedProject)) {
          const nextPhase = getNextPhase(updatedProject.currentPhase);
          if (nextPhase) {
            updatedProject.currentPhase = nextPhase;
            updatedProject.phaseNumber = getPhaseNumber(nextPhase);
          }
        }

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? updatedProject : p
          ),
        }));
      },

      uncompleteAction: (projectId, trigger) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;

        // Remove the action from completedActions
        const updatedActions = project.completedActions.filter(
          (a) => a.trigger !== trigger
        );

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  completedActions: updatedActions,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      advancePhase: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;

        const nextPhase = getNextPhase(project.currentPhase);
        if (nextPhase) {
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    currentPhase: nextPhase,
                    phaseNumber: getPhaseNumber(nextPhase),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        }
      },

      setPhase: (projectId, phaseId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  currentPhase: phaseId,
                  phaseNumber: getPhaseNumber(phaseId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      saveGemOutput: (projectId, trigger, output, savedBy) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;

        const newOutput: GemOutput = {
          trigger,
          output,
          savedAt: new Date().toISOString(),
          savedBy,
        };

        // Replace existing output for this trigger or add new one
        const existingIndex = (project.gemOutputs || []).findIndex((o) => o.trigger === trigger);
        const updatedOutputs = [...(project.gemOutputs || [])];

        if (existingIndex >= 0) {
          updatedOutputs[existingIndex] = newOutput;
        } else {
          updatedOutputs.push(newOutput);
        }

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  gemOutputs: updatedOutputs,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      getGemOutput: (projectId, trigger) => {
        const project = get().projects.find((p) => p.id === projectId);
        return (project?.gemOutputs || []).find((o) => o.trigger === trigger);
      },

      saveUserInput: (projectId, trigger, input) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;

        const updatedInputs = {
          ...(project.userInputs || {}),
          [trigger]: {
            ...input,
            savedAt: new Date().toISOString(),
          },
        };

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userInputs: updatedInputs,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      getUserInput: (projectId, trigger) => {
        const project = get().projects.find((p) => p.id === projectId);
        return project?.userInputs?.[trigger];
      },

      getProject: (id) => {
        return get().projects.find((p) => p.id === id);
      },

      getProjectsByRM: (rmName) => {
        return get().projects.filter(
          (p) => p.researchManager.toLowerCase() === rmName.toLowerCase()
        );
      },

      getProjectsByPhase: (phaseId) => {
        return get().projects.filter((p) => p.currentPhase === phaseId);
      },

      getActiveProjects: () => {
        return get().projects.filter((p) => p.status === "active");
      },
    }),
    {
      name: "rx-hub-projects",
    }
  )
);

// Action trigger descriptions for UI
export const ACTION_DESCRIPTIONS: Record<ActionTrigger, string> = {
  // Pre-Kickoff
  dossier_generated: "Dossier completo generado (contexto + cliente + industria)",
  context_research_done: "Investigacion de contexto completada",
  // Kickoff Meeting
  ko_deck_generated: "Presentacion de KO generada",
  transcription_processed: "Transcripcion del meeting procesada",
  ko_meeting_done: "Meeting de KO completado",
  // Briefing & Design
  research_brief_created: "Research Brief generado con IA",
  brief_created: "Research Brief creado",
  survey_designed: "Encuesta disenada",
  questionnaire_approved: "Cuestionario aprobado",
  // Programming & QC
  txt_generated: "Archivo TXT generado",
  programming_qc_done: "QC de programacion con IA completado",
  survey_programmed: "Survey programado en Qualtrics",
  qc_passed: "QC de programacion aprobado",
  // Launch & Monitoring
  soft_launch_done: "Soft launch completado",
  soft_launch_analyzed: "Analisis de soft launch completado",
  full_launch_done: "Full launch completado",
  fieldwork_complete: "Fieldwork completado",
  oe_coded: "Respuestas abiertas codificadas",
  // Analysis Plan
  analysis_plan_created: "Plan de analisis creado",
  data_cuts_defined: "Data cuts definidos",
  // Analysis & Insights
  insights_generated: "Insights generados",
  report_drafted: "Reporte borrador completado",
  // Report QC
  report_qc_validated: "Reporte validado vs crosstabs",
  report_qc_passed: "QC de reporte aprobado",
  report_delivered: "Reporte entregado al cliente",
};
