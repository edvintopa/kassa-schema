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
  // New states for navigation
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);

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
    // Clear navigation selection and default to first field (name)
    setSelectedRowIndex(null);
    setSelectedColumnIndex(0);
  };

  const handleDeleteRow = (id: number) => {
    setSchedule(schedule.filter((row) => row.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditData(null);
      setIsNew(false);
    }
    // Also clear navigation if the deleted row was selected
    if (selectedRowIndex !== null) {
      const index = schedule.findIndex(row => row.id === id);
      if (index === selectedRowIndex) {
        setSelectedRowIndex(null);
      }
    }
  };

  const handleEditStart = (row: ScheduleRow) => {
    setEditingId(row.id);
    setEditData({ ...row });
    setIsNew(false);
    // When a row is manually clicked, clear navigation selection
    setSelectedRowIndex(null);
    setSelectedColumnIndex(null);
  };

  const handleInputChange = (field: keyof ScheduleRow, value: string | number) => {
    if (!editData) return;
    const updatedData = { ...editData, [field]: value };
    setEditData(updatedData);
  };

  const handleSave = () => {
    if (!editData) return;
    
    const formattedStart = formatTimeInput(editData.shiftStart);
    const formattedEnd = formatTimeInput(editData.shiftEnd);
    
    if (!validateTimeFormat(formattedStart) || !validateTimeFormat(formattedEnd)) {
      alert('Invalid time format. Please use HH:MM in 24-hour format.');
      return;
    }
    
    const oldRow = schedule.find(row => row.id === editData.id);
    const suggestedBreak = calculateBreakTime(formattedStart, formattedEnd);
    
    let breakTime = editData.totalBrakeTime;
    if (!oldRow || breakTime === oldRow.totalBrakeTime) {
      breakTime = suggestedBreak;
    }
    
    const updatedRow = {
      ...editData,
      shiftStart: formattedStart,
      shiftEnd: formattedEnd,
      totalBrakeTime: breakTime
    };
    
    setSchedule(schedule.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    setEditingId(null);
    setEditData(null);
    setIsNew(false);
    // Clear selection
    setSelectedRowIndex(null);
    setSelectedColumnIndex(null);
  };

  const handleCancel = () => {
    if (isNew && editingId !== null) {
      setSchedule(schedule.filter(row => row.id !== editingId));
    }
    setEditingId(null);
    setEditData(null);
    setIsNew(false);
    // Clear selection on cancel
    setSelectedRowIndex(null);
    setSelectedColumnIndex(null);
  };

  // New: Extended keydown handler for navigation and editing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop propagation to prevent the global listener from also handling this event
    e.stopPropagation();
    
    if (editingId !== null) {
      // In editing mode, use left/right to navigate fields and Enter to save
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (selectedColumnIndex === null) setSelectedColumnIndex(0);
        else if (selectedColumnIndex > 0) setSelectedColumnIndex(selectedColumnIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (selectedColumnIndex === null) setSelectedColumnIndex(0);
        else if (selectedColumnIndex < 3) setSelectedColumnIndex(selectedColumnIndex + 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    } else {
      // When not editing, handle arrow up/down and Enter to start editing a row.
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedRowIndex === null) {
          setSelectedRowIndex(0);
        } else {
          setSelectedRowIndex(Math.max(selectedRowIndex - 1, 0));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedRowIndex === null) {
          setSelectedRowIndex(schedule.length - 1);
        } else {
          setSelectedRowIndex(Math.min(selectedRowIndex + 1, schedule.length - 1));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedRowIndex !== null) {
          const row = schedule[selectedRowIndex];
          handleEditStart(row);
          setSelectedColumnIndex(0); // default to first field
        }
      }
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
    handleKeyDown,
    // Expose navigation states so the component can highlight selected rows/fields
    selectedRowIndex,
    selectedColumnIndex,
    // Also allow clearing selection from a mouse click if needed
    clearSelection: () => {
      setSelectedRowIndex(null);
      setSelectedColumnIndex(null);
    }
  };
}