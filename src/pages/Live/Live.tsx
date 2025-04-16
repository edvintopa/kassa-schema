import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScheduleRow } from "../../types";
import LiveDaySchedule from "../../components/liveView/LiveDaySchedule/LiveDaySchedule";
import LiveBreakSchedule from "../../components/liveView/LiveBreakSchedule/LiveBreakSchedule";
import TimeControls from "../../components/test/TimeControls";

function Live() {
  const [schedule, setSchedule] = useState<ScheduleRow[] | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [testMode, setTestMode] = useState<boolean>(false);
  const location = useLocation();

  // Load schedule data from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const scheduleParam = queryParams.get('schedule');
    
    if (scheduleParam) {
      try {
        const decodedSchedule = JSON.parse(decodeURIComponent(scheduleParam));
        setSchedule(decodedSchedule);
      } catch (error) {
        console.error('Failed to parse schedule data:', error);
      }
    }
  }, [location]);

  // Update time automatically when not in test mode
  useEffect(() => {
    if (testMode) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [testMode]);

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
        <div className="w-full md:w-1/2 h-[700px] flex">
          <div className="w-full overflow-hidden flex flex-col">
            <LiveDaySchedule 
              schedule={schedule} 
              currentTime={currentTime} 
            />
          </div>
        </div>
        
        {/* Right column - Break schedule */}
        <div className="w-full md:w-1/2 h-[700px] flex">
          <div className="w-full overflow-hidden flex flex-col">
            <LiveBreakSchedule 
              schedule={schedule} 
              currentTime={currentTime} 
            />
          </div>
        </div>
      </div>
      
      {/* Time Controls */}
      <TimeControls
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        testMode={testMode}
        setTestMode={setTestMode}
      />
    </div>
  );
}

export default Live;