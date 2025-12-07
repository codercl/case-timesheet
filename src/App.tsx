import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Box, List, ListItem, ListItemButton, ListItemText, Divider, Drawer, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import TimeSheet from './components/timesheet/TimeSheet'
import Employees from './components/employees/Employees'

import { useState } from 'react'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Drawer open button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
        {/* Left navigation - Temporary Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 200,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 2, mt: 4 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/employees" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Employees" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/timesheet" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Timesheet" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Right content area - remaining width */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6 }}>
          <Routes>
            <Route path="/" element={<Employees />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/timesheet" element={<TimeSheet />} />
            <Route path="/timesheet/:employeeId" element={<TimeSheet />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  )
}

export default App
