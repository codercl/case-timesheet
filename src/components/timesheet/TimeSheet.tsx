import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import SearchTimeSheet from './SearchTimesheet'
import Calendar from './Calendar'
import WeeklyTimesheet from './WeeklyTimesheet'

export default function TimeSheet() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
 
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Timesheet
      </Typography>
      <SearchTimeSheet />
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mt: 3 }}>
        <Box>
          <Calendar onDateSelect={handleDateSelect} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <WeeklyTimesheet selectedDate={selectedDate} />
        </Box>
      </Stack>
    </Box>
  )
}