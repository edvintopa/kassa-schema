import { useState, useEffect } from 'react';
import { ScheduleRow } from '../types';
import { loadDaySchedule, saveDaySchedule, saveBreakSchedule } from '../utils/storageUtils';
import { assignBreaks } from '../utils/breakUtils';

export function usePersistentSchedule() {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);

  // Load stored day schedule on mount
  useEffect(() => {
    const storedSchedule = loadDaySchedule();
    if (storedSchedule.length > 0) {
      setSchedule(storedSchedule);
    }
  }, []);

  // Save day and break schedules whenever the day schedule changes
  useEffect(() => {
    saveDaySchedule(schedule);
    const breakSchedule = assignBreaks(schedule);
    saveBreakSchedule(breakSchedule);
  }, [schedule]);

  return { schedule, setSchedule };
}