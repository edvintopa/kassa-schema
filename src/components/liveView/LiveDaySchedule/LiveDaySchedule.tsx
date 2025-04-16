import React from 'react';
import { ScheduleRow } from '../../../types';
import LiveSchedule from '../LiveSchedule/LiveSchedule';

interface LiveDayScheduleProps {
  schedule: ScheduleRow[];
  currentTime?: Date; // Accept current time from parent
}

const LiveDaySchedule: React.FC<LiveDayScheduleProps> = ({ schedule, currentTime }) => {
  return (
    <LiveSchedule
      items={schedule}
      startTimeKey="shiftStart"
      endTimeKey="shiftEnd"
      currentTime={currentTime} // Pass current time to LiveSchedule
      emptyMessage="Inget schema tillgängligt"
      columns={[
        {
          name: "Personal",
          render: (person) => (
            <div className="text-2xl font-medium text-gray-900 dark:text-neutral-100">
              {person.name}
            </div>
          )
        },
        {
          name: "Pass",
          render: (person) => (
            <div className="text-xl text-gray-600 dark:text-neutral-300">
              {person.shiftStart} - {person.shiftEnd}
            </div>
          )
        }
      ]}
    />
  );
};

export default LiveDaySchedule;