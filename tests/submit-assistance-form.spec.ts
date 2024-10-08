import { test, expect } from '@playwright/test';

test('submit assistance form', async ({ page }) => {
  const newTicketURL = 'https://arc.assistenza.pagopa.it/hc/it/requests/new';
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
  const pagePromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Assistenza' }).click();
  const newPage = await pagePromise;
  await newPage.getByTestId('confirm-email').click();
  await newPage.getByTestId('confirm-email').fill('testuser@testmail.it');
  await newPage.getByTestId('confirm-email').press('Tab');
  await newPage.getByTestId('assistance-confirm-email').fill('testuser@testmail.it');
  await newPage.getByTestId('assistance-confirm-email').press('Tab');
  await newPage.getByTestId('assistance-confirm-button').click();
  await expect(newPage).toHaveURL(newTicketURL, { timeout: 10000 });
});
