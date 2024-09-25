import { test, expect } from '@playwright/test';

test('test if there are receipts for the user', async ({ page }) => {
  const maxItems = 5;
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
  await expect(page.getByLabel('Storico table')).toBeVisible();
  const tableRowsCount = await page.getByTestId('transaction-details-button').count();
  await expect(tableRowsCount).toBeGreaterThan(0);
  await expect(tableRowsCount).toBeLessThanOrEqual(maxItems);
});
