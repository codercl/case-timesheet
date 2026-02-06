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
  IconButton,
  Dialog,
  TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null)
  const [editTime, setEditTime] = useState('')

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

  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

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

    const totalSeconds = Math.floor(totalMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const weeklyTotalHours = useMemo(() => {
    let totalMs = 0
    for (const day of weekDays) {
      const events = getEventLogsForDay(day)
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
    }
    
    const totalSeconds = Math.floor(totalMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
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

  const handleDeleteLog = (logId: number) => {
    const updated = logs.filter((l) => l.id !== logId)
    setLogs(updated)
    saveTimeLogs(updated)
  }

  const handleEditLog = (log: TimeLog) => {
    setEditingLog(log)
    const date = new Date(log.timestamp || '')
    setEditTime(date.toISOString().slice(0, 16))
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingLog) return
    const updated = logs.map((l) =>
      l.id === editingLog.id
        ? { ...l, timestamp: new Date(editTime).toISOString() }
        : l
    )
    setLogs(updated)
    saveTimeLogs(updated)
    setEditDialogOpen(false)
    setEditingLog(null)
    setEditTime('')
  }

  const handleCancelEdit = () => {
    setEditDialogOpen(false)
    setEditingLog(null)
    setEditTime('')
  }

  if (!employeeExists) {
    return null
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weekly Timesheet
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => handleCheckIn(selectedDate || today)}
          disabled={hasOpenCheckIn(selectedDate || today)}
        >
          Check-in
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => handleCheckOut(selectedDate || today)}
          disabled={!hasOpenCheckIn(selectedDate || today)}
        >
          Check-out
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Total Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weekDays.map((day, idx) => (
              <TableRow key={idx}>
                <TableCell>{day.toLocaleDateString()}</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  {(() => {
                    const logs = getEventLogsForDay(day).filter((l) => l.activity === 'checkIn' && !!l.timestamp)
                    if (!logs.length) return <Typography variant="body2">—</Typography>
                    return (
                      <Stack direction="column" spacing={0.5}>
                        {logs.map((log, i) => (
                          <Stack key={i} direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body2">{new Date(log.timestamp as string).toLocaleTimeString()}</Typography>
                            <IconButton size="small" onClick={() => handleEditLog(log)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteLog(log.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>
                    )
                  })()}
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  {(() => {
                    const logs = getEventLogsForDay(day).filter((l) => l.activity === 'checkOut' && !!l.timestamp)
                    if (!logs.length) return <Typography variant="body2">—</Typography>
                    return (
                      <Stack direction="column" spacing={0.5}>
                        {logs.map((log, i) => (
                          <Stack key={i} direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body2">{new Date(log.timestamp as string).toLocaleTimeString()}</Typography>
                            <IconButton size="small" onClick={() => handleEditLog(log)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteLog(log.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>
                    )
                  })()}
                </TableCell>
                <TableCell>{getTotalHours(day)}</TableCell>
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
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edit Time
          </Typography>
          <TextField
            type="datetime-local"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  )
}
