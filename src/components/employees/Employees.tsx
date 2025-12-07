import EmployeesTableEditable from './EmployeesTableEditable'
import { Box, Typography, Button } from '@mui/material'
import { useState } from 'react'
import type { Employee } from '../../data/employees'
import { loadEmployees, saveEmployees } from '../../data/employees'

export default function Employees() {
  const [rows, setRows] = useState<Employee[]>(loadEmployees())

  const addEmployee = () => {
    setRows((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((p) => p.id ?? 0)) + 1 : 1
      return [...prev, { id: nextId, name: '', role: '', status: 'active' }]
    })
  }

  const onSave = () => {
    saveEmployees(rows)
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Employees Overview
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={addEmployee}>
          Add Employee
        </Button>
        <Button variant="outlined" color="secondary" onClick={onSave}>
          Save All
        </Button>
      </Box>
      <EmployeesTableEditable rows={rows} setRows={setRows} />
    </Box>
  )
}
