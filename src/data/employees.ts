import type { Employee } from '../types';

export type { Employee } from '../types';

export const sampleEmployees: Employee[] = [
  { id: 1, name: 'Alice Johnson', role: 'Software Engineer', status: 'active' },
  { id: 2, name: 'Bob Smith', role: 'Product Manager', status: 'active' },
  { id: 3, name: 'Carol Lee', role: 'Designer', status: 'active' },
];

const LS_KEY = 'employees_v1'

export function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return sampleEmployees
    const parsed = JSON.parse(raw) as Employee[]
    return parsed
  } catch {
    return sampleEmployees
  }
}

export function saveEmployees(employees: Employee[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(employees))
  } catch {
    // ignore
  }
}
