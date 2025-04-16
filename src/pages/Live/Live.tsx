import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScheduleRow, Break } from "../../types";

function Live() {
  const [schedule, setSchedule] = useState<ScheduleRow[] | null>(null);
  const [debug, setDebug] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const scheduleParam = queryParams.get('schedule');
    
    if (scheduleParam) {
      try {
        const decodedSchedule = JSON.parse(decodeURIComponent(scheduleParam));
        setSchedule(decodedSchedule);
        // Save first item for debugging
        if (decodedSchedule && decodedSchedule.length > 0) {
          setDebug(JSON.stringify(decodedSchedule[0], null, 2));
        }
      } catch (error) {
        console.error('Failed to parse schedule data:', error);
      }
    }
  }, [location]);

  if (!schedule) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Live Schedule View</h1>
        <p>No schedule data available. Please use a valid schedule URL.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Today's Schedule</h1>
      
      {/* Debug section - remove after fixing */}
      <div className="bg-gray-100 p-3 rounded mb-6">
        <details>
          <summary className="cursor-pointer font-medium">Debug Data Structure</summary>
          <pre className="mt-2 text-xs overflow-auto">{debug}</pre>
        </details>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.map((person: ScheduleRow) => (
          <div key={person.id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">{person.name}</h2>
            <p className="mb-3">
              <span className="font-medium">Shift: </span>
              {person.shiftStart} - {person.shiftEnd}
            </p>
            
            {/* Display breaks if they exist */}
            {person.breaks && person.breaks.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-1">Breaks:</h3>
                <ul className="list-disc pl-5">
                  {person.breaks.map((breakItem: Break) => (
                    <li key={breakItem.id} className="mb-1">
                      {breakItem.breakStart} - {breakItem.breakEnd} 
                      {breakItem.duration && ` (${breakItem.duration} min)`}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 italic">No breaks scheduled</p>
            )}
            
            {person.totalBrakeTime > 0 && !person.breaks && (
              <p className="mb-1">
                <span className="font-medium">Total break time: </span>
                {person.totalBrakeTime} minutes
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Live;