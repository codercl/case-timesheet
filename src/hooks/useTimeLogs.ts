import { useState, useCallback } from 'react';
import type { TimeLog } from '../types';
import { loadTimeLogs as loadTimeLogsFromStorage, saveTimeLogs as saveTimeLogsToStorage, sampleTimeLogs } from '../data/timelogs';

export function useTimeLogs() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(loadTimeLogsFromStorage);
  const [isSaving, setIsSaving] = useState(false);

  const addTimeLog = useCallback((log: Omit<TimeLog, 'id'>) => {
    setTimeLogs((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((l) => l.id ?? 0)) + 1 : 1;
      return [...prev, { ...log, id: nextId }];
    });
  }, []);

  const updateTimeLog = useCallback((id: number, updates: Partial<TimeLog>) => {
    setTimeLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updates } : log))
    );
  }, []);

  const deleteTimeLog = useCallback((id: number) => {
    setTimeLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  const getLogsByEmployee = useCallback((employeeId: number) => {
    return timeLogs.filter((log) => log.employeeId === employeeId);
  }, [timeLogs]);

  const getLogsByDate = useCallback((date: string) => {
    return timeLogs.filter((log) => log.date === date);
  }, [timeLogs]);

  const saveTimeLogs = useCallback(async () => {
    setIsSaving(true);
    try {
      saveTimeLogsToStorage(timeLogs);
    } finally {
      setIsSaving(false);
    }
  }, [timeLogs]);

  const resetTimeLogs = useCallback(() => {
    setTimeLogs(sampleTimeLogs);
  }, []);

  return {
    timeLogs,
    setTimeLogs,
    addTimeLog,
    updateTimeLog,
    deleteTimeLog,
    getLogsByEmployee,
    getLogsByDate,
    saveTimeLogs,
    resetTimeLogs,
    isSaving,
  };
}
