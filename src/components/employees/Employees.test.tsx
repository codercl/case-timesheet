import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Employees from './Employees'
import * as useEmployeesModule from '../../hooks/useEmployees'

vi.mock('../../hooks/useEmployees')

describe('Employees', () => {
  const mockUseEmployees = {
    employees: [],
    setEmployees: vi.fn(),
    addEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    deleteEmployee: vi.fn(),
    saveEmployees: vi.fn(),
    resetEmployees: vi.fn(),
    isSaving: false,
  }

  beforeEach(() => {
    vi.spyOn(useEmployeesModule, 'useEmployees').mockReturnValue(mockUseEmployees)
  })

  it('should render Employees heading', () => {
    render(<Employees />)
    const heading = screen.getByText('Employees Overview')
    expect(heading).toBeDefined()
  })

  it('should call addEmployee when Add Employee button is clicked', () => {
    render(<Employees />)
    fireEvent.click(screen.getByText('Add Employee'))
    expect(mockUseEmployees.addEmployee).toHaveBeenCalled()
  })

  it('should call saveEmployees when Save All button is clicked', () => {
    render(<Employees />)
    fireEvent.click(screen.getByText('Save All'))
    expect(mockUseEmployees.saveEmployees).toHaveBeenCalled()
  })
})
