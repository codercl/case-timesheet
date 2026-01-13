import EmployeesTableEditable from './EmployeesTableEditable'
import { Box, Typography, Button } from '@mui/material'
import { useEmployees } from '../../hooks/useEmployees'

export default function Employees() {
  const { employees, setEmployees, addEmployee, saveEmployees, isSaving } = useEmployees()

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Employees Overview
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={addEmployee}>
          Add Employee
        </Button>
        <Button variant="outlined" color="secondary" onClick={saveEmployees} disabled={isSaving}>
          Save All
        </Button>
      </Box>
      <EmployeesTableEditable rows={employees} setRows={setEmployees} />
    </Box>
  )
}
