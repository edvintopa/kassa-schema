import { useState } from 'react';
import { ScheduleRow, Break } from '../types';

interface UseScheduleSharingProps {
  schedule: ScheduleRow[];
  breaks: Break[] | null;
}

export function useScheduleSharing({ schedule, breaks }: UseScheduleSharingProps) {
  const [copied, setCopied] = useState(false);

  // Create a combined schedule with assigned breaks for sharing
  const generateScheduleWithBreaks = () => {
    return schedule.map((person: ScheduleRow) => {
      // Find breaks for this person
      const personBreaks = breaks ? 
        breaks.filter(breakItem => breakItem.name === person.name) : 
        [];
      
      // Return person with their breaks included
      return {
        ...person,
        breaks: personBreaks.length > 0 ? personBreaks : undefined
      };
    });
  };

  const generateLiveUrl = () => {
    const baseUrl = window.location.origin;
    // Adjust path as needed for your routing setup
    const schedulePath = '/kassa-schema/#/live'; 
    const scheduleWithBreaks = generateScheduleWithBreaks();
    const encodedSchedule = encodeURIComponent(JSON.stringify(scheduleWithBreaks));
    return `${baseUrl}${schedulePath}?schedule=${encodedSchedule}`;
  };
  
  // New function to generate print URL
  const generatePrintUrl = () => {
    const baseUrl = window.location.origin;
    // Use the print path
    const schedulePath = '/kassa-schema/#/print'; 
    const scheduleWithBreaks = generateScheduleWithBreaks();
    const encodedSchedule = encodeURIComponent(JSON.stringify(scheduleWithBreaks));
    return `${baseUrl}${schedulePath}?schedule=${encodedSchedule}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateLiveUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    copied,
    generateLiveUrl,
    generatePrintUrl, // Export the new function
    copyToClipboard
  };
}