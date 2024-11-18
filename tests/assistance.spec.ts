import { test, expect } from '@playwright/test';

test('[E2E-ARC-11] Come Cittadino autenticato voglio accedere alla sezione di Assistenza in modo da aprire una segnalazione', async ({
  page
}) => {
  const newTicketURL = 'https://pagamenti.assistenza.pagopa.it/hc/it-it/requests/new';
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
  const pagePromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Assistenza' }).click();
  const newPage = await pagePromise;
  await expect(newPage.getByTestId('confirm-email')).not.toHaveValue('', {timeout: 2000});
  const userEmail = await newPage.getByTestId('confirm-email').inputValue();
  await newPage.getByTestId('assistance-confirm-email').fill(userEmail);
  await newPage.getByTestId('assistance-confirm-email').dispatchEvent('change');
  await newPage.getByTestId('assistance-confirm-button').click();
  await expect(newPage).toHaveURL(newTicketURL, { timeout: 10000 });
});
