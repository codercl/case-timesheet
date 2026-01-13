import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useEmployees } from './useEmployees'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useEmployees', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    localStorageMock.getItem.mockRestore()
    localStorageMock.setItem.mockRestore()
  })

  it('should return employees from localStorage or sample data', () => {
    const { result } = renderHook(() => useEmployees())
    expect(result.current.employees).toBeDefined()
    expect(Array.isArray(result.current.employees)).toBe(true)
  })

  it('should add a new employee', () => {
    const { result } = renderHook(() => useEmployees())
    const initialLength = result.current.employees.length

    act(() => {
      result.current.addEmployee()
    })

    expect(result.current.employees.length).toBe(initialLength + 1)
    const newEmployee = result.current.employees[result.current.employees.length - 1]
    expect(newEmployee.name).toBe('')
    expect(newEmployee.role).toBe('')
    expect(newEmployee.status).toBe('active')
  })

  it('should update an employee', () => {
    const { result } = renderHook(() => useEmployees())
    const employee = result.current.employees[0]
    if (!employee) return

    act(() => {
      result.current.updateEmployee(employee.id, { name: 'John Doe' })
    })

    const updated = result.current.employees.find(e => e.id === employee.id)
    expect(updated?.name).toBe('John Doe')
  })

  it('should delete an employee', () => {
    const { result } = renderHook(() => useEmployees())
    const employee = result.current.employees[0]
    if (!employee) return

    const initialLength = result.current.employees.length
    act(() => {
      result.current.deleteEmployee(employee.id)
    })

    expect(result.current.employees.length).toBe(initialLength - 1)
    expect(result.current.employees.find(e => e.id === employee.id)).toBeUndefined()
  })
})
