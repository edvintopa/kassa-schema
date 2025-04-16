import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScheduleRow } from '../../../types';

interface LiveDayScheduleProps {
  schedule: ScheduleRow[];
}

const LiveDaySchedule: React.FC<LiveDayScheduleProps> = ({ schedule }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prevCompletedIds, setPrevCompletedIds] = useState<Set<number>>(new Set());
  
  // Check if a shift is completed
  const isShiftCompleted = (shiftEnd: string): boolean => {
    const [endHour, endMinute] = shiftEnd.split(':').map(Number);
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    return currentTime > end;
  };
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Track which items have just become completed
  useEffect(() => {
    const currentCompletedIds = new Set(
      schedule
        .filter(item => isShiftCompleted(item.shiftEnd))
        .map(item => item.id)
    );
    
    setPrevCompletedIds(currentCompletedIds);
  }, [schedule, currentTime]);
  
  // Calculate if a shift was just completed (for enhanced animation)
  const wasJustCompleted = (id: number): boolean => {
    return !prevCompletedIds.has(id) && isShiftCompleted(
      schedule.find(item => item.id === id)?.shiftEnd || ''
    );
  };
  
  // Calculate shift progress percentage
  const getShiftProgress = (shiftStart: string, shiftEnd: string): number => {
    const [startHour, startMinute] = shiftStart.split(':').map(Number);
    const [endHour, endMinute] = shiftEnd.split(':').map(Number);
    
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    const shiftDuration = end.getTime() - start.getTime();
    const elapsedTime = currentTime.getTime() - start.getTime();
    const progress = Math.max(0, Math.min(100, (elapsedTime / shiftDuration) * 100));
    
    return progress;
  };

  // Sort schedule with active shifts at top, completed at bottom
  const sortedSchedule = useMemo(() => {
    const activeShifts: ScheduleRow[] = [];
    const completedShifts: ScheduleRow[] = [];
    
    schedule.forEach(shift => {
      if (isShiftCompleted(shift.shiftEnd)) {
        completedShifts.push(shift);
      } else {
        activeShifts.push(shift);
      }
    });
    
    const sortByStartTime = (a: ScheduleRow, b: ScheduleRow) => {
      const [aHour, aMinute] = a.shiftStart.split(':').map(Number);
      const [bHour, bMinute] = b.shiftStart.split(':').map(Number);
      
      if (aHour !== bHour) {
        return aHour - bHour;
      }
      return aMinute - bMinute;
    };
    
    return [...activeShifts.sort(sortByStartTime), ...completedShifts.sort(sortByStartTime)];
  }, [schedule, currentTime]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden text-start h-full flex flex-col">
      <div className="min-w-full flex flex-col flex-1">
        {/* Header row */}
        <div className="grid grid-cols-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-10">
          <div className="px-10 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
            Personal
          </div>
          <div className="px-10 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
            Pass
          </div>
        </div>
        
        {/* Table body */}
        <div className="divide-y divide-gray-200 dark:divide-neutral-700 overflow-y-auto flex-1">
          <AnimatePresence>
            {sortedSchedule.map((person: ScheduleRow) => {
              const progress = getShiftProgress(person.shiftStart, person.shiftEnd);
              const completed = isShiftCompleted(person.shiftEnd);
              const justCompleted = wasJustCompleted(person.id);
              
              return (
                <motion.div 
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
                  layout
                  layoutId={`row-${person.id}`}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ 
                    opacity: completed ? 0.6 : 1,
                    scale: justCompleted ? [1, 1.05, 1] : 1,
                    transition: { 
                      duration: 0.3,
                      scale: {
                        duration: 0.5,
                        times: [0, 0.5, 1]
                      }
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: { 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 25 
                    }
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveDaySchedule;