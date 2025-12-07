## Overview
This app provides a simple employee management and weekly timesheet system built with React, TypeScript, Vite, and Material UI.

## Features
- Timesheet
  - Weekly table showing each day of the selected week.
  - Check-in and Check-out event lists rendered one time per line.
  - Total Hours calculated by pairing sequential `checkIn` → `checkOut` events per day.
  - Button gating logic:
    - `Check-out` is disabled until an unmatched `Check-in` exists for the day.
    - `Check-in` is disabled while there is an open session (before the next `Check-out`).
  - Time logs persisted to `localStorage` under key `timelogs_v1`.

- Employees
  - Editable table of employees with `Name`, `Role`, and `Status` (active/inactive).
  - Add Employee creates a new row with an auto-incremented ID.
  - Toggle Status controls access to the employee’s Timesheet.
  - “Timesheet” button navigates to `/timesheet/:employeeId` for the selected employee.
  - Employees persisted to `localStorage` under key `employees_v1`.
  - Inputs have visible labels to meet accessibility requirements.
  - Row-level Actions column removed for simplicity; a page-level “Save All” persists changes.

- Search Timesheet
  - Search by `id` or `name` using values loaded from persisted employees.
  - Navigates to the selected employee’s timesheet route.

## Getting Started
1. Install dependencies:
   - `npm install`
2. Run the dev server:
   - `npm run dev`
3. Open the app:
   - `http://localhost:5173/`

## Usage Tips
- Employees:
  - Edit `Name` and `Role`, toggle `Status`, then click “Save All” to persist.
  - Inactive employees cannot navigate to their timesheet.
- Timesheet:
  - Click `Check-in` to start a session; `Check-out` becomes enabled.
  - Click `Check-out` to end the session; `Check-in` re-enables.
  - Multiple sessions per day are supported; total hours sum all pairs.
- Calendar:
  - Choose a date to switch the visible week; the table reflects the week containing that date.

## Data Persistence
- Employees: `localStorage` key `employees_v1`.
- Time Logs: `localStorage` key `timelogs_v1`.
- If the keys don’t exist or parsing fails, the app falls back to sample data.

### Resetting Data
- To reset, clear the relevant keys in the browser devtools:
  - Open DevTools → Application → Storage → Local Storage → `http://localhost:5173/`
  - Remove `employees_v1` and/or `timelogs_v1`.

## Accessibility
- Form fields include visible labels to satisfy “every form element has a label”.
- Button states convey session availability (disabled when action is invalid).
- First Pass by Accessibility Insight for Web

## Known Limitations / TODO
- Employees table: pagination and sorting are not implemented.
- No backend and No State Management in Frontend; data is client-side only via `localStorage`.
- No time zone configuration; times use browser locale.

## Tech Stack
- `React`, `TypeScript`, `Vite`, `Material UI`.
