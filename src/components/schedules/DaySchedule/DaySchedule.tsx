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
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow dark:shadow-neutral-700">
      <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Schema</h2>
        <button 
          onClick={handleAddRow}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-blue-600 dark:text-blue-400"
          aria-label="Add row"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                Namn
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                Start
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                Stop
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                Rast
              </th>
              <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                Åtgärder
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {schedule.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Inget schema än. Tryck på + för att fortsätta...
                </td>
              </tr>
            ) : (
              schedule.map((row) => (
                <tr key={row.id} className="dark:hover:bg-neutral-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editData?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border dark:border-neutral-600 rounded px-2 py-1 w-full dark:bg-neutral-700 dark:text-neutral-100"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-900 dark:text-neutral-100 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 px-2 py-1 rounded min-h-[28px]"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.name || '—'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editData?.shiftStart || ''}
                        onChange={(e) => handleInputChange('shiftStart', e.target.value)}
                        className="border dark:border-neutral-600 rounded px-2 py-1 w-full dark:bg-neutral-700 dark:text-neutral-100"
                        placeholder="HH:MM"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-900 dark:text-neutral-100 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 px-2 py-1 rounded min-h-[28px]"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.shiftStart || '—'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === row.id ? (
                      <input
                        type="text"
                        value={editData?.shiftEnd || ''}
                        onChange={(e) => handleInputChange('shiftEnd', e.target.value)}
                        className="border dark:border-neutral-600 rounded px-2 py-1 w-full dark:bg-neutral-700 dark:text-neutral-100"
                        placeholder="HH:MM"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-900 dark:text-neutral-100 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 px-2 py-1 rounded min-h-[28px]"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.shiftEnd || '—'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === row.id ? (
                      <input
                        type="number"
                        value={editData?.totalBrakeTime || 0}
                        onChange={(e) => handleInputChange('totalBrakeTime', parseInt(e.target.value) || 0)}
                        className="border dark:border-neutral-600 rounded px-2 py-1 w-full dark:bg-neutral-700 dark:text-neutral-100"
                      />
                    ) : (
                      <div 
                        className="text-sm text-neutral-900 dark:text-neutral-100 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 px-2 py-1 rounded min-h-[28px]"
                        onClick={() => handleEditStart(row)}
                      >
                        {row.totalBrakeTime || 0}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === row.id ? (
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={handleSave}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                        >
                          Spara
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300"
                        >
                          Avbryt
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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