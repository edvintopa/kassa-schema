import React, { useState, useEffect, useMemo } from 'react';
import { ScheduleRow, Break } from '../../../types';

interface LiveBreakScheduleProps {
  schedule: ScheduleRow[];
}

const LiveBreakSchedule: React.FC<LiveBreakScheduleProps> = ({ schedule }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Extract all breaks from all schedule rows into a flat array of breaks with person name
  const allBreaks = useMemo(() => {
    const breaks: (Break & { personName: string })[] = [];
    
    schedule.forEach(person => {
      if (person.breaks && person.breaks.length > 0) {
        person.breaks.forEach(breakItem => {
          breaks.push({
            ...breakItem,
            personName: person.name
          });
        });
      }
    });
    
    return breaks;
  }, [schedule]);
  
  // Calculate break progress percentage
  const getBreakProgress = (breakStart: string, breakEnd: string): number => {
    // Parse times as hours and minutes
    const [startHour, startMinute] = breakStart.split(':').map(Number);
    const [endHour, endMinute] = breakEnd.split(':').map(Number);
    
    // Create Date objects for today with these times
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    // Calculate total break duration in milliseconds
    const breakDuration = end.getTime() - start.getTime();
    
    // Calculate elapsed time
    const elapsedTime = currentTime.getTime() - start.getTime();
    
    // Calculate progress percentage (clamped between 0-100)
    const progress = Math.max(0, Math.min(100, (elapsedTime / breakDuration) * 100));
    
    return progress;
  };

  // Check if a break is completed
  const isBreakCompleted = (breakEnd: string): boolean => {
    if (!breakEnd) return false;
    
    const [endHour, endMinute] = breakEnd.split(':').map(Number);
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    return currentTime > end;
  };
  
  // Check if a break has started
  const hasBreakStarted = (breakStart: string): boolean => {
    if (!breakStart) return false;
    
    const [startHour, startMinute] = breakStart.split(':').map(Number);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    return currentTime >= start;
  };

  // Calculate remaining time in minutes for an active break
  const calculateRemainingTime = (breakEnd: string): string => {
    const [endHour, endMinute] = breakEnd.split(':').map(Number);
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    // Calculate remaining time in milliseconds
    const remainingMs = end.getTime() - currentTime.getTime();
    
    // Convert to minutes (rounded up)
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    
    return `${remainingMinutes} min`;
  };

  // Sort breaks with active first (sorted by start time), then completed (sorted by start time)
  const sortedBreaks = useMemo(() => {
    // First separate active, upcoming, and completed breaks
    const activeBreaks: (Break & { personName: string })[] = [];
    const upcomingBreaks: (Break & { personName: string })[] = [];
    const completedBreaks: (Break & { personName: string })[] = [];
    
    allBreaks.forEach(breakItem => {
      if (isBreakCompleted(breakItem.breakEnd)) {
        completedBreaks.push(breakItem);
      } else if (hasBreakStarted(breakItem.breakStart)) {
        activeBreaks.push(breakItem);
      } else {
        upcomingBreaks.push(breakItem);
      }
    });
    
    // Sort each group by start time
    const sortByBreakStart = (a: Break, b: Break) => {
      const [aHour, aMinute] = a.breakStart.split(':').map(Number);
      const [bHour, bMinute] = b.breakStart.split(':').map(Number);
      
      if (aHour !== bHour) {
        return aHour - bHour;
      }
      return aMinute - bMinute;
    };
    
    // Return active breaks first, then upcoming, then completed
    return [
      ...activeBreaks.sort(sortByBreakStart), 
      ...upcomingBreaks.sort(sortByBreakStart),
      ...completedBreaks.sort(sortByBreakStart)
    ];
  }, [allBreaks, currentTime]);

  if (sortedBreaks.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 text-center">
        <p className="text-xl text-gray-600 dark:text-neutral-300">Inga raster inplanerade</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden text-start">
      <div className="min-w-full">
        {/* Header row */}
        <div className="grid grid-cols-3 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-700">
          <div className="px-8 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
            Personal
          </div>
          <div className="px-8 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
            Rast
          </div>
          <div className="px-8 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider text-right">
            Längd
          </div>
        </div>
        
        {/* Table body */}
        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
          {sortedBreaks.map((breakItem) => {
            const progress = getBreakProgress(breakItem.breakStart, breakItem.breakEnd);
            const completed = isBreakCompleted(breakItem.breakEnd);
            const started = hasBreakStarted(breakItem.breakStart);
            const durationFormatted = `${breakItem.duration} min`;
            
            // Determine background color
            let bgColor = 'transparent';
            if (progress > 0) {
              if (completed) {
                bgColor = 'rgba(209, 213, 219, 0.3)'; // Gray for completed
              } else if (started) {
                bgColor = 'rgba(72, 167, 218, 0.2)'; // Blue for active breaks
              }
            }
            
            return (
              <div 
                key={breakItem.id} 
                className={`relative grid grid-cols-3 hover:bg-gray-50/30 dark:hover:bg-neutral-700/30 ${
                  completed ? 'opacity-60' : ''
                }`}
                style={{
                  backgroundImage: `linear-gradient(to right, 
                    ${bgColor} ${progress}%, 
                    transparent ${progress}%)`
                }}
              >
                {/* Name cell */}
                <div className="px-8 py-6 whitespace-nowrap">
                  <div className="text-2xl font-medium text-gray-900 dark:text-neutral-100">
                    {breakItem.personName}
                  </div>
                </div>
                
                                {/* Break time cell */}
                <div className="px-8 py-6 whitespace-nowrap">
                  <div className="text-xl text-gray-600 dark:text-neutral-300">
                    {breakItem.breakStart} - {breakItem.breakEnd}
                  </div>
                </div>
                
                {/* Duration cell */}
                <div className="px-8 py-6 whitespace-nowrap text-right">
                  <div className="text-xl text-gray-600 dark:text-neutral-300">
                    {started && !completed ? (
                      <>
                        {/* Show remaining time for active breaks */}
                        {calculateRemainingTime(breakItem.breakEnd)} kvar
                      </>
                    ) : (
                      /* Show total duration for upcoming and completed breaks */
                      durationFormatted
                    )}
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

export default LiveBreakSchedule;