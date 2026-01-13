import { test, expect } from '@playwright/test'

test.describe('Employees Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employees')
  })

  test('should display Employees heading', async ({ page }) => {
    await expect(page.getByText('Employees Overview')).toBeVisible()
  })

  test('should have Add Employee button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Employee/i })).toBeVisible()
  })

  test('should have Save All button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Save All/i })).toBeVisible()
  })
})

test.describe('Timesheet Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timesheet')
  })

  test('should display Timesheet heading', async ({ page }) => {
    await expect(page.getByText('Timesheet')).toBeVisible()
  })

  test('should display Search Timesheet section', async ({ page }) => {
    await expect(page.getByText('Search Timesheet')).toBeVisible()
  })

  test('should have navigation drawer button', async ({ page }) => {
    await expect(page.locator('[aria-label="open drawer"]')).toBeVisible()
  })
})
