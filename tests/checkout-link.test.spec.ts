import { test, expect } from '@playwright/test';

test('checkout link test', async ({ page }) => {
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
  await page.getByRole('link', { name: 'Paga un avviso' }).click();
  const newTabPromise = page.waitForEvent('popup');

  const newTab = await newTabPromise;
  await newTab.waitForLoadState();

  await expect(newTab).toHaveURL(new RegExp('checkout.pagopa.it/'));
});
