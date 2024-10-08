import { test, expect } from '@playwright/test';

test('test if the error page is shown correctly to the user when an error occurs', async ({
  page
}) => {
  await page.route('*/**/arc/v1/transactions*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json'
    });
  });

  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
  await expect(page.getByTestId('ErrorOutlineIcon')).toBeVisible({ timeout: 50000 });
});
