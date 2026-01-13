import { useMemo, useEffect, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Stack,
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import { loadTimeLogs, saveTimeLogs } from '../../data/timelogs'
import { loadEmployees } from '../../data/employees'
import type { TimeLog } from '../../data/timelogs'
import type { Employee } from '../../data/employees'

type Props = {
  selectedDate: Date | null
}

let idCounter = Date.now()

function generateId(): number {
  return ++idCounter
}

export default function WeeklyTimesheet({ selectedDate }: Props) {
  const [logs, setLogs] = useState<TimeLog[]>(loadTimeLogs())
  const employees: Employee[] = useMemo(() => loadEmployees(), [])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>()

  const location = useLocation()
  useEffect(() => {
    const pathParts = location.pathname.split('/')
    const timesheetIndex = pathParts.indexOf('timesheet')
    const empIdStr = timesheetIndex >= 0 && timesheetIndex + 1 < pathParts.length ? pathParts[timesheetIndex + 1] : ''
    const empId = empIdStr ? Number(empIdStr) : null
      
    if (empId) {
        const emp = employees.find((x) => x.id === empId)
        if (emp) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedEmployeeId(empId)
        }
    }
  }, [employees, location.pathname])

  const weekDays = useMemo(() => {
    if (!selectedDate) return []
    const date = new Date(selectedDate)
    const day = date.getDay()
    const start = new Date(date)
    start.setDate(date.getDate() - day)
    
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days
  }, [selectedDate])

  const employeeExists = useMemo(() => {
    return employees.some((emp) => emp.id === selectedEmployeeId)
  }, [selectedEmployeeId, employees])

  const getLogsForDay = (day: Date) => {
    const dateStr = day.toISOString().slice(0, 10)
    return logs.filter(
      (log) => log.date === dateStr && (!selectedEmployeeId || log.employeeId === selectedEmployeeId)
    )
  }

  const getEventLogsForDay = (day: Date) => {
    const events = getLogsForDay(day).filter((l) => !!l.activity && !!l.timestamp)
    return events.sort((a, b) => {
      const ta = new Date(a.timestamp as string).getTime()
      const tb = new Date(b.timestamp as string).getTime()
      return ta - tb
    })
  }

  const getTotalHours = (day: Date) => {
    const events = getEventLogsForDay(day)
    let totalMs = 0
    let currentCheckIn: number | null = null

    for (const e of events) {
      const ts = new Date(e.timestamp as string).getTime()
      if (e.activity === 'checkIn') {
        currentCheckIn = ts
      } else if (e.activity === 'checkOut') {
        if (currentCheckIn != null && ts >= currentCheckIn) {
          totalMs += ts - currentCheckIn
          currentCheckIn = null
        }
      }
    }

    const hours = totalMs / (1000 * 60 * 60)
    return hours.toFixed(2)
  }

  const weeklyTotalHours = useMemo(() => {
    let total = 0
    for (const day of weekDays) {
      const hours = parseFloat(getTotalHours(day))
      total += hours
    }
    return total.toFixed(2)
  }, [weekDays, logs])

  const hasOpenCheckIn = (day: Date) => {
    const events = getEventLogsForDay(day)
    let currentCheckIn: number | null = null
    for (const e of events) {
      const ts = new Date(e.timestamp as string).getTime()
      if (e.activity === 'checkIn') {
        currentCheckIn = ts
      } else if (e.activity === 'checkOut') {
        if (currentCheckIn != null && ts >= currentCheckIn) {
          currentCheckIn = null
        }
      }
    }
    return currentCheckIn != null
  }

  const handleCheckIn = (day: Date) => {
    const dateStr = day.toISOString().slice(0, 10)
    const newLog: TimeLog = {
      id: generateId(),
      date: dateStr,
      hours: 0,
      description: 'Check-in',
      employeeId: selectedEmployeeId || 1,
      activity: 'checkIn',
      timestamp: new Date().toISOString(),
    }
    const updated = [...logs, newLog]
    setLogs(updated)
    saveTimeLogs(updated)
  }

  const handleCheckOut = (day: Date) => {
    const dateStr = day.toISOString().slice(0, 10)
    const newLog: TimeLog = {
      id: generateId(),
      date: dateStr,
      hours: 0,
      description: 'Check-out',
      employeeId: selectedEmployeeId || 1,
      activity: 'checkOut',
      timestamp: new Date().toISOString(),
    }
    const updated = [...logs, newLog]
    setLogs(updated)
    saveTimeLogs(updated)
  }

  if (!employeeExists) {
    return null
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weekly Timesheet
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weekDays.map((day, idx) => (
              <TableRow key={idx}>
                <TableCell>{day.toLocaleDateString()}</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  {(() => {
                    const times = getEventLogsForDay(day)
                      .filter((l) => l.activity === 'checkIn' && !!l.timestamp)
                      .map((l) => new Date(l.timestamp as string).toLocaleTimeString())
                    if (!times.length) return <Typography variant="body2">—</Typography>
                    return (
                      <Stack direction="column" spacing={0.5}>
                        {times.map((t, i) => (
                          <Typography key={i} variant="body2">{t}</Typography>
                        ))}
                      </Stack>
                    )
                  })()}
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  {(() => {
                    const times = getEventLogsForDay(day)
                      .filter((l) => l.activity === 'checkOut' && !!l.timestamp)
                      .map((l) => new Date(l.timestamp as string).toLocaleTimeString())
                    if (!times.length) return <Typography variant="body2">—</Typography>
                    return (
                      <Stack direction="column" spacing={0.5}>
                        {times.map((t, i) => (
                          <Typography key={i} variant="body2">{t}</Typography>
                        ))}
                      </Stack>
                    )
                  })()}
                </TableCell>
                <TableCell>{getTotalHours(day)}h</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="contained" onClick={() => handleCheckIn(day)} disabled={hasOpenCheckIn(day)}>
                      Check-in
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => handleCheckOut(day)} disabled={!hasOpenCheckIn(day)}>
                      Check-out
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell colSpan={3} align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  Weekly Total:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  {weeklyTotalHours}h
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
