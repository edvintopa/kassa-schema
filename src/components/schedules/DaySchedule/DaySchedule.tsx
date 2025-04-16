import React, { useEffect, useRef } from 'react';
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
    handleCancel,
    handleKeyDown,
    selectedRowIndex,
    selectedColumnIndex,
    clearSelection
  } = useScheduleEditor({ schedule, setSchedule });

  // Create refs for each field  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const shiftStartRef = useRef<HTMLInputElement>(null);
  const shiftEndRef = useRef<HTMLInputElement>(null);
  const breakInputRef = useRef<HTMLInputElement>(null);

  // Focus the correct input field when editing and selectedColumnIndex changes.
  useEffect(() => {
    if (editingId !== null && selectedColumnIndex !== null) {
      switch (selectedColumnIndex) {
        case 0:
          nameInputRef.current?.focus();
          break;
        case 1:
          shiftStartRef.current?.focus();
          break;
        case 2:
          shiftEndRef.current?.focus();
          break;
        case 3:
          breakInputRef.current?.focus();
          break;
        default:
          break;
      }
    }
  }, [editingId, selectedColumnIndex]);

  // Global listener to handle Enter key when no input is focused.
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // When in edit mode, do nothing so Enter isn't interpreted as "add new row"
      if (editingId) return;
  
      if (
        e.key === 'Enter' &&
        document.activeElement?.tagName !== 'INPUT'
      ) {
        e.preventDefault();
        if (selectedRowIndex !== null) {
          handleKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>);
        } else {
          handleAddRow();
        }
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [editingId, handleAddRow, selectedRowIndex, handleKeyDown]);

  // Global listener to intercept arrow keys and prevent page scroll.
  useEffect(() => {
    const handleGlobalArrowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>);
      }
    };
    document.addEventListener('keydown', handleGlobalArrowKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalArrowKeyDown);
  }, [editingId, handleKeyDown]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow dark:shadow-neutral-700" onClick={clearSelection}>
      <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          Schema
        </h2>
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
        <table className="w-full divide-y divide-neutral-200 dark:divide-neutral-600">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800">
              <th className="w-1/4 px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Namn</th>
              <th className="w-1/6 px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Start</th>
              <th className="w-1/6 px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Stop</th>
              <th className="w-1/6 px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Rast</th>
              <th className="w-1/6 px-5 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-600">
            {schedule.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-neutral-600 dark:text-neutral-300">
                  Inget schema än. Klicka på + eller tryck <span className="font-bold">ENTER</span> för att fortsätta...
                </td>
              </tr>
            ) : (
              schedule.map((row, index) => (
                <tr key={row.id} 
                    className={`hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors 
                      ${!editingId && selectedRowIndex === index ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                >
                  {/* Name Column */}
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={editData?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`border rounded px-3 py-1.5 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none
                          ${editingId && selectedColumnIndex === 0 ? 'border-blue-500' : 'border-neutral-300 dark:border-neutral-600'} 
                          dark:bg-neutral-700 dark:text-neutral-100`}
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
                  {/* Start Column */}
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        ref={shiftStartRef}
                        type="text"
                        value={editData?.shiftStart || ''}
                        onChange={(e) => handleInputChange('shiftStart', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="HH:MM"
                        className={`border rounded px-3 py-1.5 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none
                          ${editingId && selectedColumnIndex === 1 ? 'border-blue-500' : 'border-neutral-300 dark:border-neutral-600'} 
                          dark:bg-neutral-700 dark:text-neutral-100`}
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
                  {/* Stop Column */}
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        ref={shiftEndRef}
                        type="text"
                        value={editData?.shiftEnd || ''}
                        onChange={(e) => handleInputChange('shiftEnd', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="HH:MM"
                        className={`border rounded px-3 py-1.5 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none
                          ${editingId && selectedColumnIndex === 2 ? 'border-blue-500' : 'border-neutral-300 dark:border-neutral-600'} 
                          dark:bg-neutral-700 dark:text-neutral-100`}
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
                  {/* Break Column */}
                  <td className="px-5 py-4">
                    {editingId === row.id ? (
                      <input
                        ref={breakInputRef}
                        type="number"
                        value={editData?.totalBrakeTime || 0}
                        onChange={(e) => handleInputChange('totalBrakeTime', parseInt(e.target.value) || 0)}
                        onKeyDown={handleKeyDown}
                        className={`border rounded px-3 py-1.5 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none
                          ${editingId && selectedColumnIndex === 3 ? 'border-blue-500' : 'border-neutral-300 dark:border-neutral-600'} 
                          dark:bg-neutral-700 dark:text-neutral-100`}
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
                  {/* Actions Column */}
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