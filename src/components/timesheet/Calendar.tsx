import { useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

type Props = {
  onDateSelect?: (date: Date) => void
}

export default function Calendar({ onDateSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    if (date && onDateSelect) {
      onDateSelect(date)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Calendar
      </Typography>
      <Paper sx={{ display: 'inline-block', p: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </Paper>
    </Box>
  )
}