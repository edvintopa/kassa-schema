import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Format time as HH:MM
  function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // Format date in Swedish (Torsdagen den 14e april 2025)
  function formatSwedishDate(date: Date): string {
    const day = date.getDate();
    const monthNames = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 
                         'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
    const weekdayNames = ['Söndagen', 'Måndagen', 'Tisdagen', 'Onsdagen', 
                          'Torsdagen', 'Fredagen', 'Lördagen'];
    
    const weekday = weekdayNames[date.getDay()];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    // Add correct suffix (e or a)
    const daySuffix = (day % 10 === 1 || day % 10 === 2) && day !== 11 && day !== 12 ? "a" : "e";
    
    return `${weekday} den ${day}:${daySuffix} ${month} ${year}`;
  }
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const time = formatTime(currentTime);
  const swedishDate = formatSwedishDate(currentTime);

  return (
    <header className="w-full bg-sky-600 shadow-neutral-900 py-4 px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold text-neutral-50">
            KASSA SCHEMA
          </Link>
        </div>
        
        {/* Middle: Swedish date */}
        <div className="flex-1 text-center">
          <p className="text-neutral-50">{swedishDate}</p>
        </div>
        
        {/* Right: Time */}
        <div className="flex-1 text-right">
          <p className="text-neutral-50 font-bold">{time}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;