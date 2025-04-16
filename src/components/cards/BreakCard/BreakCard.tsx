import React from 'react';

export interface BreakCardProps {
  id: string | number;
  name: string;
  breakStart: string;
  breakEnd: string;
  duration: number;
}

const BreakCard: React.FC<BreakCardProps> = ({
  name,
  breakStart,
  breakEnd,
  duration
}) => {
  return (
    <div 
      className="border border-neutral-200 dark:border-neutral-600 rounded-lg p-3 mb-3 bg-white dark:bg-neutral-800 shadow-sm dark:shadow-neutral-900"
    >
      <div className="font-semibold dark:text-neutral-100">{name}</div>
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        {breakStart} - {breakEnd}
      </div>
      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
        {duration} min
      </span>
    </div>
  );
};

export default BreakCard;