import { useState, useEffect, useMemo } from 'react';

interface TimeItem {
  id: string | number;
  startTime: string;
  endTime: string;
}

export function useTimeTracking<T extends TimeItem>(
  items: T[],
  startTimeKey: keyof T = 'startTime' as keyof T,
  endTimeKey: keyof T = 'endTime' as keyof T
) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prevStates, setPrevStates] = useState<Map<string | number, string>>(new Map());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Helper functions for time calculations
  const isCompleted = (endTime: string): boolean => {
    if (!endTime) return false;
    
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    return currentTime > end;
  };
  
  const hasStarted = (startTime: string): boolean => {
    if (!startTime) return false;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    return currentTime >= start;
  };
  
  const getProgress = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    const duration = end.getTime() - start.getTime();
    const elapsedTime = currentTime.getTime() - start.getTime();
    const progress = Math.max(0, Math.min(100, (elapsedTime / duration) * 100));
    
    return progress;
  };

  const calculateRemainingTime = (endTime: string): string => {
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
    
    const remainingMs = end.getTime() - currentTime.getTime();
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    
    return `${remainingMinutes} min`;
  };
  
  // Track state changes for items
  useEffect(() => {
    const newStates = new Map<string | number, string>();
    
    items.forEach(item => {
      const startTime = String(item[startTimeKey]);
      const endTime = String(item[endTimeKey]);
      
      if (isCompleted(endTime)) {
        newStates.set(item.id, 'completed');
      } else if (hasStarted(startTime)) {
        newStates.set(item.id, 'active');
      } else {
        newStates.set(item.id, 'upcoming');
      }
    });
    
    setPrevStates(newStates);
  }, [items, currentTime, startTimeKey, endTimeKey]);

  // Helper to check if an item just changed state
  const hasChangedState = (id: string | number): boolean => {
    const item = items.find(i => i.id === id);
    if (!item) return false;
    
    const startTime = String(item[startTimeKey]);
    const endTime = String(item[endTimeKey]);
    
    const currentState = isCompleted(endTime) 
      ? 'completed' 
      : hasStarted(startTime)
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
      const startTime = String(item[startTimeKey]);
      const endTime = String(item[endTimeKey]);
      
      if (isCompleted(endTime)) {
        completedItems.push(item);
      } else if (hasStarted(startTime)) {
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

  return {
    currentTime,
    sortedItems,
    isCompleted,
    hasStarted,
    getProgress,
    hasChangedState,
    calculateRemainingTime
  };
}