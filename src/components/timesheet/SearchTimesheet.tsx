import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
    TextField,
    Typography,
    Stack,
    Button,
} from '@mui/material'
import { loadEmployees } from '../../data/employees'
import type { Employee } from '../../data/employees'


export default function SearchTimeSheet() {
    const employees: Employee[] = useMemo(() => loadEmployees(), [])

    const [selectedType, setSelectedType] = useState<string | ''>('')
    const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)
    const initialized = useRef(false)
    
    // Initialize from URL on mount
    const location = useLocation()
    useEffect(() => {
      if (initialized.current) return
      initialized.current = true
      
      const pathParts = location.pathname.split('/')
      const timesheetIndex = pathParts.indexOf('timesheet')
      const empIdStr = timesheetIndex >= 0 && timesheetIndex + 1 < pathParts.length ? pathParts[timesheetIndex + 1] : ''
      const empId = empIdStr ? Number(empIdStr) : null
      
      if (empId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedType('id')
        const emp = employees.find((x) => x.id === empId) ?? null
        setSelectedEmp(emp)
      }
    }, [employees, location.pathname])


    const handleSelectChange = (_e: React.SyntheticEvent | Event, val: unknown) => {
        const stringVal = val as string
        setSelectedType(stringVal)
        setSelectedEmp(null)
    }

    const handleAutoChange = (_e: React.SyntheticEvent, value: number | string | null) => {
        if (selectedType === 'id') {
            const id = value ? Number(value) : null
            const emp = employees.find((x) => x.id === id) ?? null
            setSelectedEmp(emp)
        } else if (selectedType === 'name') {
            const name = value ? String(value) : null
            const emp = employees.find((x) => x.name === name) ?? null
            setSelectedEmp(emp)
        }
    }

    const navigate = useNavigate()
    const handleSearch = () => {
        if (selectedEmp) {
          navigate(`/timesheet/${selectedEmp.id}`)
        } else {
          navigate('/timesheet')
        }
    }        

    const options: (number | string)[] = useMemo(() => {
        if (selectedType === 'id') {
          return employees.map((e) => e.id)
        } else if (selectedType === 'name') {
          return employees.map((e) => e.name)
        }
        return []
    }, [selectedType, employees])

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Search Timesheet
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 220 }} size="small">
                    <InputLabel id="employee-select-label">Types</InputLabel>
                    <Select
                        labelId="employee-select-label"
                        value={selectedType}
                        label="Types"
                        onChange={handleSelectChange}
                    >
                        {["id", "name"].map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Autocomplete<number | string, false, false, false>
                    sx={{ minWidth: 260 }}
                    options={options}
                    getOptionLabel={(opt) => String(opt)}
                    value={selectedType === 'id' ? (selectedEmp ? selectedEmp.id : null) : (selectedEmp ? selectedEmp.name : null)}
                    onChange={handleAutoChange}
                    renderInput={(params) => <TextField {...params} label="Find employee" size="small" />}
                />

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleSearch}
                    disabled={!selectedEmp}
                >
                    Search
                </Button>
            </Stack>
        </Box>
    )
}
