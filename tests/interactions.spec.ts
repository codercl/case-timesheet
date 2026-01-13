import { test, expect } from '@playwright/test'

test.describe('Employees Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/employees')
  })

  test('should navigate to Employees page', async ({ page }) => {
    await expect(page).toHaveURL(/employees/)
  })

  test('should have a table with employee rows', async ({ page }) => {
    const table = page.locator('table')
    await expect(table).toBeVisible()
  })
})

test.describe('Timesheet Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timesheet')
  })

  test('should navigate to Timesheet page', async ({ page }) => {
    await expect(page).toHaveURL(/timesheet/)
  })

  test('should have search dropdown', async ({ page }) => {
    const select = page.locator('form').locator('select')
    await expect(select).toBeVisible()
  })

  test('should have search button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Search/i })).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should open drawer when menu button clicked', async ({ page }) => {
    await page.goto('/')
    await page.locator('[aria-label="open drawer"]').click()
    await expect(page.getByText('Employees')).toBeVisible()
    await expect(page.getByText('Timesheet')).toBeVisible()
  })
})
