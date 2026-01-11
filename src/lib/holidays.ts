/**
 * Holiday definitions for Mexico and USA
 * Used for business day calculations in timeline generation
 */

export interface Holiday {
  name: string;
  month: number; // 0-indexed (January = 0)
  day: number;
  floating?: boolean; // True if it moves to nearest Monday
}

// Mexican Federal Holidays
export const MEXICAN_HOLIDAYS: Holiday[] = [
  { name: "Ano Nuevo", month: 0, day: 1 },
  { name: "Dia de la Constitucion", month: 1, day: 5, floating: true }, // First Monday of February
  { name: "Natalicio de Benito Juarez", month: 2, day: 21, floating: true }, // Third Monday of March
  { name: "Dia del Trabajo", month: 4, day: 1 },
  { name: "Dia de la Independencia", month: 8, day: 16 },
  { name: "Dia de la Revolucion", month: 10, day: 20, floating: true }, // Third Monday of November
  { name: "Navidad", month: 11, day: 25 },
];

// US Federal Holidays
export const US_HOLIDAYS: Holiday[] = [
  { name: "New Year's Day", month: 0, day: 1 },
  { name: "Martin Luther King Jr. Day", month: 0, day: 15, floating: true }, // Third Monday of January
  { name: "Presidents Day", month: 1, day: 15, floating: true }, // Third Monday of February
  { name: "Memorial Day", month: 4, day: 25, floating: true }, // Last Monday of May
  { name: "Independence Day", month: 6, day: 4 },
  { name: "Labor Day", month: 8, day: 1, floating: true }, // First Monday of September
  { name: "Thanksgiving", month: 10, day: 22, floating: true }, // Fourth Thursday of November
  { name: "Christmas Day", month: 11, day: 25 },
];

/**
 * Get the nth occurrence of a weekday in a month
 */
function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let day = 1 + ((weekday - firstWeekday + 7) % 7);
  day += (n - 1) * 7;
  return new Date(year, month, day);
}

/**
 * Get the last occurrence of a weekday in a month
 */
function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const diff = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month, lastDay.getDate() - diff);
}

/**
 * Get all holidays for a specific year (both MX and US)
 */
export function getHolidaysForYear(year: number): Date[] {
  const holidays: Date[] = [];

  // Process Mexican holidays
  for (const holiday of MEXICAN_HOLIDAYS) {
    if (holiday.floating) {
      // Constitution Day: First Monday of February
      if (holiday.month === 1 && holiday.day === 5) {
        holidays.push(getNthWeekdayOfMonth(year, 1, 1, 1)); // Monday = 1
      }
      // Benito Juarez: Third Monday of March
      else if (holiday.month === 2 && holiday.day === 21) {
        holidays.push(getNthWeekdayOfMonth(year, 2, 1, 3));
      }
      // Revolution Day: Third Monday of November
      else if (holiday.month === 10 && holiday.day === 20) {
        holidays.push(getNthWeekdayOfMonth(year, 10, 1, 3));
      }
    } else {
      holidays.push(new Date(year, holiday.month, holiday.day));
    }
  }

  // Process US holidays
  for (const holiday of US_HOLIDAYS) {
    if (holiday.floating) {
      // MLK Day: Third Monday of January
      if (holiday.month === 0 && holiday.day === 15) {
        holidays.push(getNthWeekdayOfMonth(year, 0, 1, 3));
      }
      // Presidents Day: Third Monday of February
      else if (holiday.month === 1 && holiday.day === 15) {
        holidays.push(getNthWeekdayOfMonth(year, 1, 1, 3));
      }
      // Memorial Day: Last Monday of May
      else if (holiday.month === 4 && holiday.day === 25) {
        holidays.push(getLastWeekdayOfMonth(year, 4, 1));
      }
      // Labor Day: First Monday of September
      else if (holiday.month === 8 && holiday.day === 1) {
        holidays.push(getNthWeekdayOfMonth(year, 8, 1, 1));
      }
      // Thanksgiving: Fourth Thursday of November
      else if (holiday.month === 10 && holiday.day === 22) {
        holidays.push(getNthWeekdayOfMonth(year, 10, 4, 4)); // Thursday = 4
      }
    } else {
      holidays.push(new Date(year, holiday.month, holiday.day));
    }
  }

  return holidays;
}

/**
 * Check if a date is a holiday
 */
export function isHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(
    (h) =>
      h.getFullYear() === date.getFullYear() &&
      h.getMonth() === date.getMonth() &&
      h.getDate() === date.getDate()
  );
}
