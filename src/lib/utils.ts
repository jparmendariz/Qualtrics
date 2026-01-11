import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(d);
  } else if (days > 0) {
    return `hace ${days} ${days === 1 ? "dia" : "dias"}`;
  } else if (hours > 0) {
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else if (minutes > 0) {
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  } else {
    return "ahora mismo";
  }
}

/**
 * Generate a unique ID
 */
export function generateId(prefix?: string): string {
  const random = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Convert phase ID to display name
 */
export function phaseIdToName(phaseId: string): string {
  const names: Record<string, string> = {
    "pre-kickoff": "Pre-Kick Off",
    "post-kickoff": "Post-Kick Off",
    "kickoff-meeting": "Kick Off Meeting",
    "briefing-design": "Briefing & Design",
    "programming-qc": "Programming & QC",
    "launch-monitoring": "Launch & Monitoring",
    "analysis-plan": "Analysis Plan",
    "analysis-insights": "Analysis & Insights",
    "report-qc": "Report QC",
  };
  return names[phaseId] || phaseId;
}

/**
 * Get phase number from ID
 */
export function phaseIdToNumber(phaseId: string): number {
  const order: Record<string, number> = {
    "pre-kickoff": 1,
    "post-kickoff": 2,
    "kickoff-meeting": 3,
    "briefing-design": 4,
    "programming-qc": 5,
    "launch-monitoring": 6,
    "analysis-plan": 7,
    "analysis-insights": 8,
    "report-qc": 9,
  };
  return order[phaseId] || 0;
}

/**
 * Validate Qualtrics question ID (max 15 chars, no spaces)
 */
export function isValidQualtricsId(id: string): boolean {
  return id.length <= 15 && !/\s/.test(id);
}

/**
 * Generate a valid Qualtrics ID from text
 */
export function generateQualtricsId(text: string, maxLength = 15): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, maxLength);
}

/**
 * Calculate survey completion percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
