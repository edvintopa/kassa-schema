import React, { useState, useEffect, useMemo } from 'react';
import { ScheduleRow } from '../../../types';

interface LiveDayScheduleProps {
  schedule: ScheduleRow[];
}

const LiveDaySchedule: React.FC<LiveDayScheduleProps> = ({ schedule }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate shift progress percentage
  const getShiftProgress = (shiftStart: string, shiftEnd: string): number => {
    // Parse times as hours and minutes
    const [startHour, startMinute] = shiftStart.split(':').map(Number);
    const [endHour, endMinute] = shiftEnd.split(':').map(Number);
    
    // Create Date objects for today with these times
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    // Calculate total shift duration in milliseconds
    const shiftDuration = end.getTime() - start.getTime();
    
    // Calculate elapsed time
    const elapsedTime = currentTime.getTime() - start.getTime();
    
    // Calculate progress percentage (clamped between 0-100)
    const progress = Math.max(0, Math.min(100, (elapsedTime / shiftDuration) * 100));
    
    return progress;
  };

  // Check if a shift is completed
  const isShiftCompleted = (shiftEnd: string): boolean => {
    const [endHour, endMinute] = shiftEnd.split(':').map(Number);
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    return currentTime > end;
  };

  // Sort schedule with active shifts at top, completed at bottom
  const sortedSchedule = useMemo(() => {
    // First separate active and completed shifts
    const activeShifts: ScheduleRow[] = [];
    const completedShifts: ScheduleRow[] = [];
    
    schedule.forEach(shift => {
      if (isShiftCompleted(shift.shiftEnd)) {
        completedShifts.push(shift);
      } else {
        activeShifts.push(shift);
      }
    });
    
    // Sort each group by start time
    const sortByStartTime = (a: ScheduleRow, b: ScheduleRow) => {
      const [aHour, aMinute] = a.shiftStart.split(':').map(Number);
      const [bHour, bMinute] = b.shiftStart.split(':').map(Number);
      
      if (aHour !== bHour) {
        return aHour - bHour;
      }
      return aMinute - bMinute;
    };
    
    // Return active shifts first, then completed shifts
    return [...activeShifts.sort(sortByStartTime), ...completedShifts.sort(sortByStartTime)];
  }, [schedule, currentTime]); // Note: added currentTime dependency

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden text-start">
      <div className="min-w-full">
        {/* Header row */}
        <div className="grid grid-cols-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-700">
          <div className="px-10 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
            Personal
          </div>
          <div className="px-10 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
            Pass
          </div>
        </div>
        
        {/* Table body */}
        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
          {sortedSchedule.map((person: ScheduleRow) => {
            const progress = getShiftProgress(person.shiftStart, person.shiftEnd);
            const completed = isShiftCompleted(person.shiftEnd);
            
            return (
              <div 
                key={person.id} 
                className={`relative grid grid-cols-2 hover:bg-gray-50/30 dark:hover:bg-neutral-700/30 ${
                  completed ? 'opacity-60' : ''
                }`}
                style={{
                  backgroundImage: `linear-gradient(to right, 
                    ${progress > 0 
                      ? completed 
                        ? 'rgba(209, 213, 219, 0.3)' // Gray for completed
                        : 'rgba(72, 167, 218, 0.2)'  // Blue for active
                      : 'transparent'
                    } ${progress}%, 
                    transparent ${progress}%)`
                }}
              >
                {/* Name cell */}
                <div className="px-10 py-6 whitespace-nowrap">
                  <div className="text-2xl font-medium text-gray-900 dark:text-neutral-100">
                    {person.name}
                  </div>
                </div>
                
                {/* Shift time cell */}
                <div className="px-10 py-6 whitespace-nowrap">
                  <div className="text-xl text-gray-600 dark:text-neutral-300">
                    {person.shiftStart} - {person.shiftEnd}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveDaySchedule;