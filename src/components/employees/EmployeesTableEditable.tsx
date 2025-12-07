import { type Dispatch, type SetStateAction } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
} from '@mui/material'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import type { Employee } from '../../data/employees'
import { Link as RouterLink } from 'react-router-dom'

type Props = {
  rows: Employee[]
  setRows: Dispatch<SetStateAction<Employee[]>>
  onSave?: () => void
}

export default function EmployeesTableEditable({ rows, setRows, onSave }: Props) {

  const updateCell = (index: number, field: keyof Employee, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  }

  const toggleStatus = (index: number) => {
    setRows((prev) => prev.map((r, i) => (
      i === index ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    )))
  }

  //TODO: table with pagination, sorting
  
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Timesheet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{row.id ?? idx + 1}</TableCell>
              <TableCell>
                <TextField
                  value={row.name}
                  size="small"
                  label="Name"
                  disabled={row.status === 'inactive'}
                  onChange={(e) => updateCell(idx, 'name', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.role}
                  size="small"
                  label="Role"
                  disabled={row.status === 'inactive'}
                  onChange={(e) => updateCell(idx, 'role', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  color={row.status === 'active' ? 'primary' : 'default'}
                  onClick={() => toggleStatus(idx)}
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {row.status === 'active' ? <ToggleOffIcon /> : <ToggleOnIcon />}
                </IconButton>
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </TableCell>
              <TableCell>
                <Button
                  component={RouterLink}
                  to={`/timesheet/${row.id}`}
                  size="small"
                  variant="text"
                  disabled={row.status === 'inactive'}
                >
                  Timesheet
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
    </TableContainer>
  )
}
