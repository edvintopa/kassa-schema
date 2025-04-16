import React, { useState, useEffect } from 'react';
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
          {schedule.map((person: ScheduleRow) => {
            const progress = getShiftProgress(person.shiftStart, person.shiftEnd);
            
            return (
              <div 
                key={person.id} 
                className="relative grid grid-cols-2 hover:bg-gray-50/30 dark:hover:bg-neutral-700/30"
                style={{
                  backgroundImage: `linear-gradient(to right, 
                    ${progress > 0 ? 'rgba(72, 167, 218, 0.2)' : 'transparent'} ${progress}%, 
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