import { useState, useEffect } from 'react';
import { ScheduleRow, Break } from '../types';
import { assignBreaks } from '../utils/breakUtils';

export function useBreakAssignment(schedule: ScheduleRow[]) {
  const [breaks, setBreaks] = useState<Break[]>([]);

  useEffect(() => {
    const initialBreaks = assignBreaks(schedule);
    setBreaks(initialBreaks);
  }, [schedule]);

  // Sort breaks by start time
  const sortedBreaks = [...breaks].sort((a, b) => 
    a.__start && b.__start ? a.__start.getTime() - b.__start.getTime() : 0
  );
  
  // 2-column split
  const midIndex = Math.ceil(sortedBreaks.length / 2);
  const firstHalf = sortedBreaks.slice(0, midIndex);
  const secondHalf = sortedBreaks.slice(midIndex);

  return {
    breaks,
    sortedBreaks,
    firstHalf,
    secondHalf,
    hasBreaks: breaks.length > 0
  };
}