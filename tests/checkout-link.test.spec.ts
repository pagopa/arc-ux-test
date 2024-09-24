import { test, expect } from '@playwright/test';

test('checkout link test', async ({ page }) => {
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/')
  await page.getByRole('link', { name: 'Paga un avviso' }).click();
  const newTabPromise = page.waitForEvent("popup");

  const newTab = await newTabPromise;
  const ENV = (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'uat') ? process.env.NODE_ENV : 'dev'; /*this is because if the env is LOCAL, the link for checkout
  will not be valid.  */
  await newTab.waitForLoadState();
  await expect(newTab).toHaveURL(`https://${ENV}.checkout.pagopa.it/`);


});
