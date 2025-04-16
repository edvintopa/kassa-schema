import { ScheduleRow, Break } from '../types';
import { parseTimeToDate, formatHHmm, alignToQuarterHour, isOverlap } from './timeUtils';

/**
 * Split total break time into 15/30-min segments
 */
function splitBreakTime(total: number): number[] {
  const segments: number[] = [];
  let remaining = total;
  while (remaining >= 30) {
    segments.push(30);
    remaining -= 30;
  }
  while (remaining >= 15) {
    segments.push(15);
    remaining -= 15;
  }
  return segments;
}

/**
 * Get preferred break starts ~2 hours in, then every ~2 hours
 */
function getPreferredBreakStartOffsets(shiftMinutes: number, breakSegments: number[]): number[] {
  const result: number[] = [];
  let currentOffset = 120; // first break ~2 hours in
  breakSegments.forEach((segment) => {
    // If the next break offset + break length is beyond shift end - 15 min, clamp it
    if (currentOffset + segment > shiftMinutes - 15) {
      currentOffset = shiftMinutes - segment - 5;
    }
    result.push(currentOffset);
    currentOffset += segment + 120; // subsequent break ~2 hrs from previous
  });
  return result;
}

/**
 * Assign breaks to employees based on their schedules
 */
export function assignBreaks(shifts: ScheduleRow[]): Break[] {
  const candidateBreaks: Array<{
    id: string;
    name: string;
    __start: Date;
    __end: Date;
    shiftStartDate: Date;
    shiftEndDate: Date;
  }> = [];

  // 1) Convert each shift to candidate breaks
  for (const shift of shifts) {
    const { id, name, shiftStart, shiftEnd, totalBrakeTime } = shift;

    // Skip if no break time is assigned
    if (!totalBrakeTime || totalBrakeTime <= 0) continue;

    // Convert "HH:mm" to JS Date
    const shiftStartDate = parseTimeToDate(shiftStart);
    const shiftEndDate = parseTimeToDate(shiftEnd);
    const shiftMinutes = (shiftEndDate.getTime() - shiftStartDate.getTime()) / 60000;

    // Split total break time into 15/30-min segments
    const breakSegments = splitBreakTime(totalBrakeTime);

    // Calculate offsets
    const offsets = getPreferredBreakStartOffsets(shiftMinutes, breakSegments);

    // For each segment, create a candidate break object
    breakSegments.forEach((segmentDuration, i) => {
      const offset = offsets[i];
      if (offset < 0 || offset >= shiftMinutes) {
        return; // skip invalid offset
      }
      const rawBreakStart = new Date(shiftStartDate.getTime() + offset * 60000);
      const alignedStart = alignToQuarterHour(new Date(rawBreakStart));

      // Store the real Date objects in hidden fields:
      const candidate = {
        id: `${id}-break-${i}-${Date.now()}`,
        name,
        __start: alignedStart,
        __end: new Date(alignedStart.getTime() + segmentDuration * 60000),
        // Store shift boundaries if needed:
        shiftStartDate,
        shiftEndDate
      };
      candidateBreaks.push(candidate);
    });
  }

  // 2) Sort candidate breaks by planned start time
  candidateBreaks.sort((a, b) => a.__start.getTime() - b.__start.getTime());

  // 3) Build finalBreaks array, skipping conflicts
  const finalBreaks: Array<{
    id: string;
    name: string;
    __start: Date;
    __end: Date;
  }> = [];
  
  for (const candidate of candidateBreaks) {
    const lastApproved = finalBreaks[finalBreaks.length - 1];

    // Clone actual dates so we can adjust them
    let adjustedStart = new Date(candidate.__start);
    let adjustedEnd = new Date(candidate.__end);

    // If there's an overlap with the last approved, push this break to after the last one ends
    if (lastApproved && isOverlap(
      { __start: adjustedStart, __end: adjustedEnd },
      lastApproved
    )) {
      adjustedStart = new Date(lastApproved.__end);
      const aligned = alignToQuarterHour(adjustedStart);
      adjustedStart = aligned;
      const duration = candidate.__end.getTime() - candidate.__start.getTime();
      adjustedEnd = new Date(adjustedStart.getTime() + duration);
    }

    // If this break starts before the shift, clamp it
    const { shiftStartDate, shiftEndDate } = candidate;
    if (adjustedStart < shiftStartDate) {
      const duration = adjustedEnd.getTime() - adjustedStart.getTime();
      adjustedStart = new Date(shiftStartDate);
      adjustedEnd = new Date(adjustedStart.getTime() + duration);
    }
    
    // If the break ends after the shift, skip it
    if (adjustedEnd > shiftEndDate) {
      continue;
    }

    // Construct the final object
    const finalCandidate = {
      id: candidate.id,
      name: candidate.name,
      __start: adjustedStart,
      __end: adjustedEnd
    };

    // Only add if not overlapping with the previously added break
    if (!lastApproved || !isOverlap(finalCandidate, lastApproved)) {
      finalBreaks.push(finalCandidate);
    }
  }

  // 4) Final sort by actual Date before returning
  finalBreaks.sort((a, b) => a.__start.getTime() - b.__start.getTime());

  // 5) Convert the final date objects into "HH:mm" strings
  return finalBreaks.map((item) => {
    const durationMinutes = (item.__end.getTime() - item.__start.getTime()) / 60000;
    return {
      id: item.id,
      name: item.name,
      breakStart: formatHHmm(item.__start),
      breakEnd: formatHHmm(item.__end),
      duration: durationMinutes,
      __start: item.__start,
      __end: item.__end
    };
  });
}