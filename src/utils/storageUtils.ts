import { ScheduleRow, Break } from '../types';

/**
 * Save the day schedule to local storage
 */
export function saveDaySchedule(schedule: ScheduleRow[]): void {
    localStorage.setItem('daySchedule', JSON.stringify(schedule));
}

/**
 * Load the day schedule from local storage
 */
export function loadDaySchedule(): ScheduleRow[] {
    const data = localStorage.getItem('daySchedule');
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing day schedule:", error);
        return [];
    }
}

/**
 * Save the break schedule to local storage
 */
export function saveBreakSchedule(breakSchedule: Break[]): void {
    localStorage.setItem('breakSchedule', JSON.stringify(breakSchedule));
}

/**
 * Load the break schedule from local storage
 */
export function loadBreakSchedule(): Break[] {
    const data = localStorage.getItem('breakSchedule');
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing break schedule:", error);
        return [];
    }
}