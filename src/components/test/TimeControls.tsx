import React from 'react';

interface TimeControlsProps {
  currentTime: Date;
  setCurrentTime: (time: Date) => void;
  testMode: boolean;
  setTestMode: (enabled: boolean) => void;
}

const TimeControls: React.FC<TimeControlsProps> = ({
  currentTime, 
  setCurrentTime,
  testMode,
  setTestMode
}) => {
  const fastForward = (minutes: number) => {
    const newTime = new Date(currentTime);
    newTime.setMinutes(newTime.getMinutes() + minutes);
    setCurrentTime(newTime);
  };
  
  const setSpecificTime = (hours: number, minutes: number) => {
    const newTime = new Date(currentTime);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    setCurrentTime(newTime);
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-neutral-700">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-gray-700 dark:text-neutral-300">
          Current time: {currentTime.toLocaleTimeString()}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => fastForward(5)} 
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
            +5 min
          </button>
          <button 
            onClick={() => fastForward(15)} 
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
            +15 min
          </button>
          <button 
            onClick={() => fastForward(30)} 
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
            +30 min
          </button>
          <button 
            onClick={() => setCurrentTime(new Date())} 
            className="px-2 py-1 bg-gray-500 text-white rounded text-xs">
            Reset
          </button>
        </div>
        
        <div className="flex gap-2 mt-2">
          <button onClick={() => setSpecificTime(9, 0)} className="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded text-xs">
            9:00
          </button>
          <button onClick={() => setSpecificTime(12, 0)} className="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded text-xs">
            12:00
          </button>
          <button onClick={() => setSpecificTime(15, 30)} className="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded text-xs">
            15:30
          </button>
          <button onClick={() => setSpecificTime(18, 0)} className="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded text-xs">
            18:00
          </button>
        </div>
        
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              checked={testMode} 
              onChange={(e) => setTestMode(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-xs text-gray-700 dark:text-neutral-300">Test mode (pause real-time)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TimeControls;