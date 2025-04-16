import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generic component that works with any type that has an id
interface LiveScheduleProps<T> {
  items: T[];
  startTimeKey: keyof T;
  endTimeKey: keyof T;
  emptyMessage: string;
  currentTime?: Date; // Optional prop to control time externally
  columns: {
    name: string;
    align?: 'left' | 'center' | 'right';
    render: (item: T, timeInfo: {
      progress: number;
      completed: boolean;
      started: boolean;
      stateChanged: boolean;
      remainingTime?: string;
    }) => React.ReactNode;
  }[];
}

function LiveSchedule<T extends { id: string | number }>({
  items,
  startTimeKey,
  endTimeKey,
  emptyMessage,
  currentTime: externalTime,
  columns
}: LiveScheduleProps<T>) {
  // Use external time if provided, otherwise manage internally
  const [internalTime, setInternalTime] = useState(new Date());
  const currentTime = externalTime || internalTime;
  
  // Only update internal time if no external time is provided
  useEffect(() => {
    if (externalTime) return; // Skip if external time is provided
    
    const timer = setInterval(() => {
      setInternalTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [externalTime]);

  const [prevStates, setPrevStates] = useState<Map<string | number, string>>(new Map());
  
  // Helper functions for time calculations
  const isCompleted = (item: T): boolean => {
    const endTime = String(item[endTimeKey]);
    if (!endTime) return false;
    
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const today = new Date(currentTime); // Use the current time
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    return currentTime > end;
  };
  
  const hasStarted = (item: T): boolean => {
    const startTime = String(item[startTimeKey]);
    if (!startTime) return false;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const today = new Date(currentTime); // Use the current time
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    return currentTime >= start;
  };
  
  const getProgress = (item: T): number => {
    const startTime = String(item[startTimeKey]);
    const endTime = String(item[endTimeKey]);
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const today = new Date(currentTime); // Use the current time
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    const duration = end.getTime() - start.getTime();
    const elapsedTime = currentTime.getTime() - start.getTime();
    const progress = Math.max(0, Math.min(100, (elapsedTime / duration) * 100));
    
    return progress;
  };

  const calculateRemainingTime = (item: T): string => {
    const endTime = String(item[endTimeKey]);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const today = new Date(currentTime); // Use the current time
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    const remainingMs = end.getTime() - currentTime.getTime();
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    
    return `${remainingMinutes} min`;
  };
  
  // Track state changes for items
    // Track state changes for items
  useEffect(() => {
    const newStates = new Map<string | number, string>();
    
    items.forEach(item => {
      if (isCompleted(item)) {
        newStates.set(item.id, 'completed');
      } else if (hasStarted(item)) {
        newStates.set(item.id, 'active');
      } else {
        newStates.set(item.id, 'upcoming');
      }
    });
    
    setPrevStates((prevState: Map<string | number, string>) => {
      // Only update if there are actual changes
      if (items.some(item => {
        const currentState = newStates.get(item.id);
        const prevState_value = prevState.get(item.id);
        return currentState !== prevState_value;
      })) {
        return newStates;
      }
      return prevState;
    });
  }, [items, currentTime, startTimeKey, endTimeKey]);

  // Helper to check if an item just changed state
  const hasChangedState = (id: string | number): boolean => {
    const item = items.find(i => i.id === id);
    if (!item) return false;
    
    const currentState = isCompleted(item) 
      ? 'completed' 
      : hasStarted(item)
        ? 'active'
        : 'upcoming';
        
    return prevStates.get(id) !== currentState && prevStates.has(id);
  };
  
  // Sort items based on their state (active/upcoming first, completed last)
  const sortedItems = useMemo(() => {
    const activeItems: T[] = [];
    const upcomingItems: T[] = [];
    const completedItems: T[] = [];
    
    items.forEach(item => {
      if (isCompleted(item)) {
        completedItems.push(item);
      } else if (hasStarted(item)) {
        activeItems.push(item);
      } else {
        upcomingItems.push(item);
      }
    });
    
    const sortByStartTime = (a: T, b: T) => {
      const aStart = String(a[startTimeKey]);
      const bStart = String(b[startTimeKey]);
      
      const [aHour, aMinute] = aStart.split(':').map(Number);
      const [bHour, bMinute] = bStart.split(':').map(Number);
      
      if (aHour !== bHour) {
        return aHour - bHour;
      }
      return aMinute - bMinute;
    };
    
    return [
      ...activeItems.sort(sortByStartTime), 
      ...upcomingItems.sort(sortByStartTime),
      ...completedItems.sort(sortByStartTime)
    ];
  }, [items, currentTime, startTimeKey, endTimeKey]);

  if (sortedItems.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 text-center h-full flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-neutral-300">{emptyMessage}</p>
      </div>
    );
  }

  // Create a grid template based on number of columns
  const gridTemplateColumns = `grid-cols-${columns.length}`;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden text-start h-full flex flex-col">
      <div className="min-w-full flex flex-col flex-1">
        {/* Header row */}
        <div className={`grid ${gridTemplateColumns} bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-10`}>
          {columns.map((column, index) => (
            <div 
              key={index} 
              className={`px-8 py-6 text-xl font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider ${
                column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''
              }`}
            >
              {column.name}
            </div>
          ))}
        </div>
        
        {/* Table body */}
        <div className="divide-y divide-gray-200 dark:divide-neutral-700 overflow-y-auto flex-1">
          <AnimatePresence>
            {sortedItems.map((item) => {
              const progress = getProgress(item);
              const completed = isCompleted(item);
              const started = hasStarted(item);
              const stateChanged = hasChangedState(item.id);
              
              // Determine background color
              let bgColor = 'transparent';
              if (progress > 0) {
                if (completed) {
                  bgColor = 'rgba(209, 213, 219, 0.3)'; // Gray for completed
                } else if (started) {
                  bgColor = 'rgba(72, 167, 218, 0.2)'; // Blue for active
                }
              }
              
              return (
                <motion.div 
                  key={item.id.toString()} 
                  className={`relative grid ${gridTemplateColumns} hover:bg-gray-50/30 dark:hover:bg-neutral-700/30 ${
                    completed ? 'opacity-60' : ''
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(to right, 
                      ${bgColor} ${progress}%, 
                      transparent ${progress}%)`
                  }}
                  layout
                  layoutId={`item-${item.id}`}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ 
                    opacity: completed ? 0.6 : 1,
                    scale: stateChanged ? [1, 1.05, 1] : 1,
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
                  {columns.map((column, index) => (
                    <div 
                      key={index} 
                      className={`px-8 py-6 whitespace-nowrap ${
                        column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''
                      }`}
                    >
                      {column.render(item, {
                        progress,
                        completed,
                        started,
                        stateChanged,
                        remainingTime: started && !completed ? calculateRemainingTime(item) : undefined
                      })}
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default LiveSchedule;