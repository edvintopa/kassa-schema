import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScheduleRow, Break } from "../../types";
import LiveDaySchedule from "../../components/liveView/LiveDaySchedule/LiveDaySchedule";

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
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-5xl font-bold mb-10 text-neutral-800 dark:text-neutral-100">Live Schedule View</h1>
        <p className="text-2xl text-neutral-700 dark:text-neutral-200">No schedule data available. Please use a valid schedule URL.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-8">
      <h1 className="text-5xl font-bold mb-10 text-neutral-800 dark:text-neutral-100">Dagens schema</h1>
      
      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left column - Staff schedule table */}
        <div className="w-full md:w-1/2">
          <LiveDaySchedule schedule={schedule} />
        </div>
        
        {/* Right column - Empty for now */}
        <div className="w-full md:w-1/2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg h-auto min-h-[400px]">
          {/* Content for right table will be added later */}
        </div>
      </div>
    </div>
  );
}

export default Live;