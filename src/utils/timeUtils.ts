import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Initialize dayjs plugins
dayjs.extend(customParseFormat);

/**
 * Parse "HH:mm" into a JS Date on a dummy day
 */
export function parseTimeToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":");
  const year = 2025;
  const month = 0; // January is 0
  const day = 1;   // Dummy day
  return new Date(year, month, day, +hours, +minutes, 0, 0);
}

/**
 * Convert Date to "HH:mm" string (24h format)
 */
export function formatHHmm(dateObj: Date): string {
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mm = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Format time input to standardized HH:mm format
 */
export function formatTimeInput(time: string): string {
  // Handle single digit (e.g., "6" to "06:00")
  if (/^\d$/.test(time)) {
    return `0${time}:00`;
  }
  // Handle two digits (e.g., "06" to "06:00")
  if (/^\d{2}$/.test(time)) {
    return `${time}:00`;
  }
  // Handle hour:minute without leading zero (e.g., "6:30" to "06:30")
  if (/^(\d):(\d{2})$/.test(time)) {
    const [hour, minute] = time.split(':');
    return `0${hour}:${minute}`;
  }
  return time;
}

/**
 * Check if a time string is valid HH:mm format
 */
export function validateTimeFormat(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

/**
 * Calculate break time based on shift duration
 */
export function calculateBreakTime(start: string, end: string): number {
  if (!start || !end) return 0;
  const startTime = dayjs(start, 'HH:mm', true);
  const endTime = dayjs(end, 'HH:mm', true);
  
  // Ensure valid times
  if (!startTime.isValid() || !endTime.isValid()) return 0;
  
  const duration = endTime.diff(startTime, 'hour');
  if (duration <= 4) return 0;
  return (duration - 4) * 15;
}

/**
 * Align to the next quarter hour
 */
export function alignToQuarterHour(date: Date): Date {
  const roundedMinutes = Math.ceil(date.getMinutes() / 15) * 15;
  const newDate = new Date(date);
  
  if (roundedMinutes === 60) {
    newDate.setHours(newDate.getHours() + 1);
    newDate.setMinutes(0);
  } else {
    newDate.setMinutes(roundedMinutes);
  }
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

/**
 * Check if two time ranges overlap
 */
export function isOverlap(
  b1: { __start: Date, __end: Date }, 
  b2: { __start: Date, __end: Date }
): boolean {
  return (
    b1.__start < b2.__end &&
    b1.__end > b2.__start
  );
}