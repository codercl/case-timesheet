import type { TimeLog } from '../types';

export type { TimeLog } from '../types';

export const sampleTimeLogs: TimeLog[] = [
  { id: 1, date: new Date().toISOString().slice(0, 10), hours: 8, description: 'Development work', employeeId: 1 },
  { id: 2, date: new Date().toISOString().slice(0, 10), hours: 2, description: 'Code review', employeeId: 1 },
]

const LS_KEY = 'timelogs_v1'

export function loadTimeLogs(): TimeLog[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return sampleTimeLogs
    const parsed = JSON.parse(raw) as TimeLog[]
    return parsed
  } catch {
    return sampleTimeLogs
  }
}

export function saveTimeLogs(logs: TimeLog[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(logs))
  } catch {
    // ignore
  }
}
