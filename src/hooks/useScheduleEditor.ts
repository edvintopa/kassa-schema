import { useState } from 'react';
import { ScheduleRow } from '../types';
import { formatTimeInput, validateTimeFormat, calculateBreakTime } from '../utils/timeUtils';

interface UseScheduleEditorProps {
  schedule: ScheduleRow[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleRow[]>>;
}

export function useScheduleEditor({ schedule, setSchedule }: UseScheduleEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<ScheduleRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleAddRow = () => {
    const newId = schedule.length ? Math.max(...schedule.map(row => row.id)) + 1 : 1;
    const newRow: ScheduleRow = {
      id: newId,
      name: '',
      shiftStart: '',
      shiftEnd: '',
      totalBrakeTime: 0
    };
    setSchedule([...schedule, newRow]);
    // Start editing the new row immediately and mark as new
    setEditingId(newId);
    setEditData(newRow);
    setIsNew(true);
  };

  const handleDeleteRow = (id: number) => {
    setSchedule(schedule.filter((row) => row.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditData(null);
      setIsNew(false);
    }
  };

  const handleEditStart = (row: ScheduleRow) => {
    setEditingId(row.id);
    setEditData({ ...row });
    setIsNew(false);
  };

  const handleInputChange = (field: keyof ScheduleRow, value: string | number) => {
    if (!editData) return;
    const updatedData = { ...editData, [field]: value };
    setEditData(updatedData);
  };

  const handleSave = () => {
    if (!editData) return;
    
    // Format and validate
    const formattedStart = formatTimeInput(editData.shiftStart);
    const formattedEnd = formatTimeInput(editData.shiftEnd);
    
    if (!validateTimeFormat(formattedStart) || !validateTimeFormat(formattedEnd)) {
      alert('Invalid time format. Please use hh:mm in 24-hour format.');
      return;
    }
    
    // Calculate suggested break
    const oldRow = schedule.find(row => row.id === editData.id);
    const suggestedBreak = calculateBreakTime(formattedStart, formattedEnd);
    
    // Update break time if it wasn't manually edited
    let breakTime = editData.totalBrakeTime;
    if (!oldRow || breakTime === oldRow.totalBrakeTime) {
      breakTime = suggestedBreak;
    }
    
    // Create the final updated row
    const updatedRow = {
      ...editData,
      shiftStart: formattedStart,
      shiftEnd: formattedEnd,
      totalBrakeTime: breakTime
    };
    
    // Update the schedule
    setSchedule(schedule.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    setEditingId(null);
    setEditData(null);
    setIsNew(false);
  };

  const handleCancel = () => {
    // Remove the new row if it was added and then canceled
    if (isNew && editingId !== null) {
      setSchedule(schedule.filter(row => row.id !== editingId));
    }
    setEditingId(null);
    setEditData(null);
    setIsNew(false);
  };

  // New: Handle key down events (Enter to save, Escape to cancel)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return {
    editingId,
    editData,
    handleAddRow,
    handleDeleteRow,
    handleEditStart,
    handleInputChange,
    handleSave,
    handleCancel,
    handleKeyDown
  };
}