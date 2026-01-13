export type Employee = {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive';
};

export type ActivityType = 'checkIn' | 'break' | 'checkOut' | 'work';

export type TimeLog = {
  id: number;
  date: string;
  hours: number;
  description: string;
  employeeId: number;
  activity?: ActivityType;
  timestamp?: string;
};
