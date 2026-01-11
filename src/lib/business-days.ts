/**
 * Business day calculator
 * Excludes weekends and Mexican/US holidays
 */

import { getHolidaysForYear, isHoliday } from "./holidays";

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Check if a date is a business day (not weekend, not holiday)
 */
export function isBusinessDay(date: Date): boolean {
  if (isWeekend(date)) return false;

  const holidays = getHolidaysForYear(date.getFullYear());
  if (isHoliday(date, holidays)) return false;

  return true;
}

/**
 * Add business days to a date
 * @param startDate - The start date
 * @param days - Number of business days to add
 * @returns The resulting date after adding business days
 */
export function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      addedDays++;
    }
  }

  return result;
}

/**
 * Phase durations in business days (using middle of range)
 */
export const PHASE_DURATIONS: Record<string, { min: number; max: number; label: string }> = {
  "pre-kickoff": { min: 2, max: 3, label: "2-3 dias" },
  "kickoff-meeting": { min: 1, max: 1, label: "1 dia" },
  "briefing": { min: 2, max: 3, label: "2-3 dias" },
  "survey-design": { min: 10, max: 10, label: "2 semanas" }, // 10 business days = 2 weeks
  "programming": { min: 3, max: 5, label: "3-5 dias" },
  "soft-launch": { min: 2, max: 3, label: "2-3 dias" },
  "full-launch": { min: 10, max: 10, label: "2 semanas" }, // 10 business days = 2 weeks
  "analysis-plan": { min: 3, max: 5, label: "3-5 dias" },
  "insights": { min: 3, max: 5, label: "3-5 dias" },
  "report": { min: 10, max: 15, label: "2-3 semanas" }, // 10-15 business days
};

/**
 * Project phases in order for timeline
 */
export const TIMELINE_PHASES = [
  { id: "pre-kickoff", name: "Pre-KO" },
  { id: "kickoff-meeting", name: "KO Meeting" },
  { id: "briefing", name: "Briefing" },
  { id: "survey-design", name: "Survey Design" },
  { id: "programming", name: "Programming" },
  { id: "soft-launch", name: "Soft Launch" },
  { id: "full-launch", name: "Full Launch" },
  { id: "analysis-plan", name: "Analysis Plan" },
  { id: "insights", name: "Insights" },
  { id: "report", name: "Report" },
];

/**
 * Calculate delivery dates for all phases based on KO start date
 * @param koStartDate - The date when Kick Off meeting starts
 * @returns Object with phase IDs as keys and estimated delivery dates as values
 */
export function calculateDeliveryDates(koStartDate: Date): Record<string, Date> {
  const deliveryDates: Record<string, Date> = {};
  let currentDate = new Date(koStartDate);

  // Pre-KO happens before the KO meeting
  const preKoDuration = Math.ceil((PHASE_DURATIONS["pre-kickoff"].min + PHASE_DURATIONS["pre-kickoff"].max) / 2);
  deliveryDates["pre-kickoff"] = new Date(koStartDate); // Due on KO date

  // KO Meeting is the start date
  currentDate = new Date(koStartDate);
  deliveryDates["kickoff-meeting"] = addBusinessDays(currentDate, 1);
  currentDate = deliveryDates["kickoff-meeting"];

  // Subsequent phases
  const phasesAfterKO = [
    "briefing",
    "survey-design",
    "programming",
    "soft-launch",
    "full-launch",
    "analysis-plan",
    "insights",
    "report",
  ];

  for (const phaseId of phasesAfterKO) {
    const duration = PHASE_DURATIONS[phaseId];
    const avgDuration = Math.ceil((duration.min + duration.max) / 2);
    currentDate = addBusinessDays(currentDate, avgDuration);
    deliveryDates[phaseId] = new Date(currentDate);
  }

  return deliveryDates;
}

/**
 * Format a date for display in slides (e.g., "Jan 15")
 */
export function formatDateShort(date: Date): string {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Format a date for display (e.g., "15 de Enero, 2024")
 */
export function formatDateLong(date: Date): string {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
}
