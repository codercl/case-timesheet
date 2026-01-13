import { useState, useCallback } from 'react';
import type { Employee } from '../types';
import { loadEmployees as loadEmployeesFromStorage, saveEmployees as saveEmployeesToStorage, sampleEmployees } from '../data/employees';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(loadEmployeesFromStorage);
  const [isSaving, setIsSaving] = useState(false);

  const addEmployee = useCallback(() => {
    setEmployees((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((p) => p.id ?? 0)) + 1 : 1;
      return [...prev, { id: nextId, name: '', role: '', status: 'active' }];
    });
  }, []);

  const updateEmployee = useCallback((id: number, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  }, []);

  const deleteEmployee = useCallback((id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const saveEmployees = useCallback(async () => {
    setIsSaving(true);
    try {
      saveEmployeesToStorage(employees);
    } finally {
      setIsSaving(false);
    }
  }, [employees]);

  const resetEmployees = useCallback(() => {
    setEmployees(sampleEmployees);
  }, []);

  return {
    employees,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    saveEmployees,
    resetEmployees,
    isSaving,
  };
}
