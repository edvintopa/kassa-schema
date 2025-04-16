export interface ScheduleRow {
  id: number;
  name: string;
  shiftStart: string;
  shiftEnd: string;
  totalBrakeTime: number;
  breaks?: Break[]; // Add this line to allow breaks property
}

export interface Break {
  id: string;
  name: string;
  breakStart: string;
  breakEnd: string;
  duration: number;
  __start?: Date;
  __end?: Date;
}