import { test, expect } from '@playwright/test';

test(`[E2E-ARC-3] Come Cittadino voglio 'sloggarmi' dall'applicativo`, async ({ page }) => {
  // mock BE response to avoid accessToken cancel
  await page.route('*/**/arc/v1/logout', async (route) => {
    const json = {};
    await route.fulfill({ json });
  });

  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
  await expect(page.getByLabel('party-menu-button')).toBeVisible();
  await page.getByLabel('party-menu-button').click();
  await page.getByRole('menuitem').getByText('Esci').click();
  await page.waitForURL('**/login');

  const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
  expect(accessToken).toBeNull();
});
