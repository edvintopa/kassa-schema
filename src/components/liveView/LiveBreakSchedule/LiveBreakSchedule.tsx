import React, { useMemo } from 'react';
import { ScheduleRow, Break } from '../../../types';
import LiveSchedule from '../LiveSchedule/LiveSchedule';

interface LiveBreakScheduleProps {
  schedule: ScheduleRow[];
  currentTime?: Date; // Accept current time from parent
}

const LiveBreakSchedule: React.FC<LiveBreakScheduleProps> = ({ schedule, currentTime }) => {
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

  return (
    <LiveSchedule
      items={allBreaks}
      startTimeKey="breakStart"
      endTimeKey="breakEnd"
      currentTime={currentTime} // Pass current time to LiveSchedule
      emptyMessage="Inga raster inplanerade"
      columns={[
        {
          name: "Personal",
          render: (breakItem) => (
            <div className="text-2xl font-medium text-gray-900 dark:text-neutral-100">
              {breakItem.personName}
            </div>
          )
        },
        {
          name: "Rast",
          render: (breakItem) => (
            <div className="text-xl text-gray-600 dark:text-neutral-300">
              {breakItem.breakStart} - {breakItem.breakEnd}
            </div>
          )
        },
        {
          name: "Längd",
          align: "right",
          render: (breakItem, timeInfo) => (
            <div className="text-xl text-gray-600 dark:text-neutral-300">
              {timeInfo.started && !timeInfo.completed ? (
                <>
                  {/* Show remaining time for active breaks */}
                  {timeInfo.remainingTime} kvar
                </>
              ) : (
                /* Show total duration for upcoming and completed breaks */
                `${breakItem.duration} min`
              )}
            </div>
          )
        }
      ]}
    />
  );
};

export default LiveBreakSchedule;