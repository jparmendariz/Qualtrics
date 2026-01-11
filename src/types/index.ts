// ===========================================
// Core Types for RX Hub
// ===========================================

// Phase types (8 phases total)
export type PhaseType =
  | "pre-kickoff"
  | "kickoff-meeting"
  | "briefing-design"
  | "programming-qc"
  | "launch-monitoring"
  | "analysis-plan"
  | "analysis-insights"
  | "report-qc";

export type PhaseStatus = "pending" | "in-progress" | "completed" | "blocked";

// Project types
export interface Project {
  id: string;
  opp: string; // Salesforce Opportunity ID
  clientName: string;
  projectName: string;
  createdAt: Date;
  updatedAt: Date;
  currentPhase: PhaseType;
  status: "active" | "completed" | "on-hold" | "cancelled";
  team: TeamMember[];
  phases: PhaseProgress[];
  metadata?: ProjectMetadata;
}

export interface ProjectMetadata {
  industry?: string;
  projectType?: ProjectType;
  targetN?: number;
  estimatedLOI?: number; // Length of Interview in minutes
  fieldworkStart?: Date;
  fieldworkEnd?: Date;
  reportDueDate?: Date;
}

export type ProjectType =
  | "brand"
  | "cx"
  | "segmentation"
  | "product"
  | "tracker"
  | "adhoc"
  | "custom";

// Team types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  isLead?: boolean;
}

export type TeamRole =
  | "research-manager"
  | "lead-analyst"
  | "qc-analyst"
  | "project-manager"
  | "sales"
  | "client";

// Phase progress
export interface PhaseProgress {
  phaseId: PhaseType;
  status: PhaseStatus;
  startedAt?: Date;
  completedAt?: Date;
  checklist: ChecklistProgress[];
  deliverables: DeliverableProgress[];
  notes?: string;
}

// Checklist types
export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  category?: string;
}

export interface ChecklistProgress extends ChecklistItem {
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
}

// Deliverable types
export interface Deliverable {
  id: string;
  phaseId: PhaseType;
  name: string;
  type: DeliverableType;
  template?: string;
  required: boolean;
}

export interface DeliverableProgress extends Deliverable {
  status: "pending" | "in-progress" | "completed" | "approved";
  content?: string;
  fileUrl?: string;
  generatedByAI: boolean;
  lastModified?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export type DeliverableType =
  | "document"
  | "presentation"
  | "spreadsheet"
  | "code"
  | "data";

// ===========================================
// Survey Types
// ===========================================

export interface Survey {
  id: string;
  projectId: string;
  name: string;
  version: number;
  status: SurveyStatus;
  blocks: SurveyBlock[];
  embeddedData: EmbeddedDataField[];
  estimatedLOI: number;
  questionCount: number;
}

export type SurveyStatus =
  | "draft"
  | "in-review"
  | "approved"
  | "programmed"
  | "testing"
  | "live"
  | "closed";

export interface SurveyBlock {
  id: string;
  name: string;
  order: number;
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string; // Max 15 chars for Qualtrics
  blockId: string;
  order: number;
  type: QuestionType;
  text: string;
  choices?: string[];
  answers?: string[]; // For matrix questions
  logic?: QuestionLogic;
  validation?: QuestionValidation;
  randomize?: boolean;
}

export type QuestionType =
  | "mc-single"
  | "mc-multi"
  | "mc-dropdown"
  | "matrix-single"
  | "matrix-multi"
  | "text-single"
  | "text-essay"
  | "constant-sum"
  | "rank-order"
  | "slider"
  | "descriptive"
  | "maxdiff";

export interface QuestionLogic {
  displayIf?: LogicCondition;
  skipTo?: string;
  terminate?: boolean;
  terminateReason?: string;
}

export interface LogicCondition {
  questionId: string;
  operator: "equals" | "not-equals" | "contains" | "greater" | "less";
  value: string | number | string[];
}

export interface QuestionValidation {
  required?: boolean;
  minSelect?: number;
  maxSelect?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface EmbeddedDataField {
  name: string;
  value?: string;
  source?: "panel" | "url" | "calculated" | "default";
}

// ===========================================
// Analysis Types
// ===========================================

export interface AnalysisPlan {
  id: string;
  projectId: string;
  version: number;
  objectives: string[];
  dataCuts: DataCut[];
  reportSections: ReportSection[];
  estimatedSlides: number;
  advancedAnalytics: AdvancedAnalytic[];
}

export interface DataCut {
  id: string;
  name: string;
  bannerPoints: BannerPoint[];
}

export interface BannerPoint {
  name: string;
  definition: string;
  minN?: number;
}

export interface ReportSection {
  id: string;
  name: string;
  order: number;
  businessQuestion?: string;
  surveyQuestions: string[];
  dataCuts: string[];
  visualizations: Visualization[];
  estimatedSlides: number;
}

export interface Visualization {
  questionId: string;
  type: VisualizationType;
  notes?: string;
}

export type VisualizationType =
  | "horizontal-bar"
  | "vertical-bar"
  | "stacked-bar"
  | "grouped-bar"
  | "line"
  | "pie"
  | "donut"
  | "heat-map"
  | "word-cloud"
  | "gauge"
  | "table";

export interface AdvancedAnalytic {
  type:
    | "weighting"
    | "segmentation"
    | "key-driver"
    | "maxdiff"
    | "conjoint"
    | "clustering";
  description: string;
  config?: Record<string, unknown>;
}

// ===========================================
// Insight Types
// ===========================================

export interface KeyFinding {
  id: string;
  priority: number; // 1-5, 1 being highest
  headline: string;
  what: string; // The data
  soWhat: string; // The implication
  nowWhat: string; // The recommendation
  supportingData: SupportingData[];
  confidence: "high" | "medium" | "low";
  slideReference?: string;
}

export interface SupportingData {
  stat: string;
  value: string | number;
  slideNumber?: number;
}

export interface SlideHeadline {
  slideNumber: number;
  questionId?: string;
  headline: string;
  callout?: string;
  implication?: string;
}

// ===========================================
// QC Types
// ===========================================

export interface QCReport {
  id: string;
  projectId: string;
  phase: PhaseType;
  createdAt: Date;
  reviewer: string;
  status: "pass" | "fail" | "needs-revision";
  checks: QCCheck[];
  issues: QCIssue[];
  signOffs: SignOff[];
}

export interface QCCheck {
  id: string;
  category: string;
  description: string;
  status: "pass" | "fail" | "na";
  notes?: string;
}

export interface QCIssue {
  id: string;
  location: string; // e.g., "Slide 15" or "Question S2"
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  status: "open" | "fixed" | "wontfix";
  resolution?: string;
  fixedAt?: Date;
}

export interface SignOff {
  role: TeamRole;
  name: string;
  date: Date;
  approved: boolean;
  notes?: string;
}

// ===========================================
// AI/Prompt Types
// ===========================================

export interface AIPromptConfig {
  model: "gemini-1.5-pro" | "gemini-1.5-flash";
  temperature: number;
  maxTokens?: number;
}

export interface AIGenerationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed?: number;
  generatedAt: Date;
}

// ===========================================
// Utility Types
// ===========================================

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> &
  Omit<T, K>;
