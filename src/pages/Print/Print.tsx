import styles from './Print.module.css';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScheduleRow } from "../../types";

function Print() {
  const [schedule, setSchedule] = useState<ScheduleRow[] | null>(null);
  const location = useLocation();

  // Load schedule data from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const scheduleParam = queryParams.get('schedule');
    
    if (scheduleParam) {
      try {
        const decodedSchedule = JSON.parse(decodeURIComponent(scheduleParam));
        setSchedule(decodedSchedule);
        
        // Auto-print when loaded
        setTimeout(() => {
          window.print();
        }, 500);
      } catch (error) {
        console.error('Failed to parse schedule data:', error);
      }
    }
  }, [location]);

  if (!schedule) {
    return (
      <div className={styles.printLoading}>
        <h1>Loading schedule data...</h1>
      </div>
    );
  }

  // Helper function to compare time strings
  const compareTimeStrings = (a: string, b: string) => {
    const [aHours, aMinutes] = a.split(':').map(Number);
    const [bHours, bMinutes] = b.split(':').map(Number);
    
    if (aHours !== bHours) {
      return aHours - bHours;
    }
    return aMinutes - bMinutes;
  };

  // Sort staff schedule by shift start time
  const sortedSchedule = [...schedule].sort((a, b) => 
    compareTimeStrings(a.shiftStart, b.shiftStart)
  );

  // Extract all breaks into a flat array and sort by break start time
  const allBreaks = schedule
    .filter(person => person.breaks && person.breaks.length > 0)
    .flatMap(person => 
      person.breaks?.map((breakItem, index) => ({
        ...breakItem,
        reactKey: `${person.id}-break-${index}` // Add a new property for React keys
      })) || []
    )
    .sort((a, b) => compareTimeStrings(a.breakStart, b.breakStart));
  
  // Split the breaks into two roughly equal groups
  const halfLength = Math.ceil(allBreaks.length / 2);
  const firstHalfBreaks = allBreaks.slice(0, halfLength);
  const secondHalfBreaks = allBreaks.slice(halfLength);

  return (
    <div className={styles.printContainer}>
      <h1 className={styles.printTitle}>Dagens Schema</h1>
      
      {/* Staff Schedule Table */}
      <div className={styles.printTable}>
        <h2>Personal</h2>
        <table className={styles.compactTable}>
          <thead>
            <tr>
              <th>Namn</th>
              <th>Pass</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchedule.map(person => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.shiftStart} - {person.shiftEnd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Break Schedule Tables - side by side */}
      <div className={styles.printTable}>
        <h2>Raster</h2>
        <div className={styles.twoColumnLayout}>
          {/* Left Break Table */}
          <div className={styles.column}>
            <table className={styles.compactTable}>
              <thead>
                <tr>
                  <th>Namn</th>
                  <th>Tid</th>
                </tr>
              </thead>
              <tbody>
                {firstHalfBreaks.map(breakItem => (
                  <tr key={breakItem.reactKey}>
                    <td>{breakItem.name}</td>
                    <td>{breakItem.breakStart} - {breakItem.breakEnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Right Break Table */}
          <div className={styles.column}>
            <table className={styles.compactTable}>
              <thead>
                <tr>
                  <th>Namn</th>
                  <th>Tid</th>
                </tr>
              </thead>
              <tbody>
                {secondHalfBreaks.map(breakItem => (
                  <tr key={breakItem.reactKey}>
                    <td>{breakItem.name}</td>
                    <td>{breakItem.breakStart} - {breakItem.breakEnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Print button - only visible on screen */}
      <button 
        onClick={() => window.print()} 
        className={styles.printButton}
      >
        Skriv ut nu
      </button>
    </div>
  );
}

export default Print;