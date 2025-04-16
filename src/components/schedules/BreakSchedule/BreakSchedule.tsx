import React from 'react';
import { ScheduleRow } from '../../../types';
import { useBreakAssignment } from '../../../hooks/useBreakAssignment';
import BreakCard from '../../cards/BreakCard/BreakCard';

interface BreakScheduleProps {
  schedule: ScheduleRow[];
}

const BreakSchedule: React.FC<BreakScheduleProps> = ({ schedule }) => {
  const { firstHalf, secondHalf, hasBreaks } = useBreakAssignment(schedule);

  if (!hasBreaks) {
    return null; // Don't render anything if there are no breaks
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow dark:shadow-neutral-700">
      <div className="p-4 border-b dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Rast schema</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left Column */}
        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[400px]">
          {firstHalf.map((br) => (
            <BreakCard
              key={br.id}
              id={br.id}
              name={br.name}
              breakStart={br.breakStart}
              breakEnd={br.breakEnd}
              duration={br.duration}
            />
          ))}
        </div>
        
        {/* Right Column */}
        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[400px]">
          {secondHalf.map((br) => (
            <BreakCard
              key={br.id}
              id={br.id}
              name={br.name}
              breakStart={br.breakStart}
              breakEnd={br.breakEnd}
              duration={br.duration}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakSchedule;