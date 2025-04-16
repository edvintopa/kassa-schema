import React from 'react';
import { ScheduleRow } from '../../../types';
import { useBreakAssignment } from '../../../hooks/useBreakAssignment';

interface BreakScheduleProps {
  schedule: ScheduleRow[];
}

const BreakSchedule: React.FC<BreakScheduleProps> = ({ schedule }) => {
  const { firstHalf, secondHalf, hasBreaks } = useBreakAssignment(schedule);

  if (!hasBreaks) {
    return null; // Don't render anything if there are no breaks
  }

  return (
    <div className="bg-white rounded-lg shadow mt-8">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Rast schema</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left Column */}
        <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
          {firstHalf.map((br) => (
            <div 
              key={br.id} 
              className="border border-gray-200 rounded-lg p-3 mb-3 bg-white shadow-sm"
            >
              <div className="font-semibold">{br.name}</div>
              <div className="text-sm text-gray-600">
                {br.breakStart} - {br.breakEnd}
              </div>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {br.duration} min
              </span>
            </div>
          ))}
        </div>
        
        {/* Right Column */}
        <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
          {secondHalf.map((br) => (
            <div 
              key={br.id} 
              className="border border-gray-200 rounded-lg p-3 mb-3 bg-white shadow-sm"
            >
              <div className="font-semibold">{br.name}</div>
              <div className="text-sm text-gray-600">
                {br.breakStart} - {br.breakEnd}
              </div>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {br.duration} min
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakSchedule;