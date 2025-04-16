import React from 'react';
import { ScheduleRow } from '../../../types';
import { useScheduleEditor } from '../../../hooks/useScheduleEditor';

interface DayScheduleProps {
  schedule: ScheduleRow[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleRow[]>>;
}

const DaySchedule: React.FC<DayScheduleProps> = ({ schedule, setSchedule }) => {
  const {
    editingId,
    editData,
    handleAddRow,
    handleDeleteRow,
    handleEditStart,
    handleInputChange,
    handleSave,
    handleCancel
  } = useScheduleEditor({ schedule, setSchedule });

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm dark:shadow-neutral-700 border border-neutral-200 dark:border-neutral-700">
      <div className="flex justify-between items-center p-5 border-b dark:border-neutral-700">
        <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">Schema</h2>
        <button 
          onClick={handleAddRow}
          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-blue-500 dark:text-blue-400 transition-colors"
          aria-label="Add row"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-750">
              <th scope="col" className="w-1/4 px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Namn
              </th>
              <th scope="col" className="w-1/6 px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Start
              </th>
              <th scope="col" className="w-1/6 px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Stop
              </th>
              <th scope="col" className="w-1/6 px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Rast
              </th>
              <th scope="col" className="w-1/6 px-5 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Åtgärder
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {schedule.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Inget schema än. Klicka på + för att lägga till...
                </td>
              </tr>
            ) : (
              schedule.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors">
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editData?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border border-neutral-300 dark:border-neutral-600 rounded px-3 py-1.5 w-full dark:bg-neutral-700 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-800 dark:text-neutral-200 py-1.5 min-h-[34px] flex items-center"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.name || '—'}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editData?.shiftStart || ''}
                        onChange={(e) => handleInputChange('shiftStart', e.target.value)}
                        className="border border-neutral-300 dark:border-neutral-600 rounded px-3 py-1.5 w-full dark:bg-neutral-700 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="HH:MM"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-800 dark:text-neutral-200 py-1.5 min-h-[34px] flex items-center"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.shiftStart || '—'}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editData?.shiftEnd || ''}
                        onChange={(e) => handleInputChange('shiftEnd', e.target.value)}
                        className="border border-neutral-300 dark:border-neutral-600 rounded px-3 py-1.5 w-full dark:bg-neutral-700 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="HH:MM"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-800 dark:text-neutral-200 py-1.5 min-h-[34px] flex items-center"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.shiftEnd || '—'}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        type="number"
                        value={editData?.totalBrakeTime || 0}
                        onChange={(e) => handleInputChange('totalBrakeTime', parseInt(e.target.value) || 0)}
                        className="border border-neutral-300 dark:border-neutral-600 rounded px-3 py-1.5 w-full dark:bg-neutral-700 dark:text-neutral-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-800 dark:text-neutral-200 py-1.5 min-h-[34px] flex items-center"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.totalBrakeTime || 0}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {editingId === row.id ? (
                      <div className="flex space-x-3 justify-end">
                        <button
                          onClick={handleSave}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Spara
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-650 transition-colors"
                        >
                          Avbryt
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-md transition-colors"
                        aria-label="Delete row"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaySchedule;