export interface ScheduleRow {
  id: number;
  name: string;
  shiftStart: string;
  shiftEnd: string;
  totalBrakeTime: number;
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