import { test, expect } from '@playwright/test';
import { getFulfilledResponse } from '../utils';

test("[E2E-ARC-2] Come Cittadino autenticato voglio accedere alla sezione 'I miei dati' per poter consultare le informazioni del mio account SPID", async ({
  page
}) => {
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');

  const user: {
    userId: string;
    fiscalCode: string;
    familyName: string;
    name: string;
    email: string;
  } = await getFulfilledResponse(page, '/user');

  await page.getByRole('button').getByText(`${user.name} ${user.familyName}`).click();
  await page.getByText('I tuoi dati').click();

  page.waitForURL('**/user');

  await expect(page.getByTestId('app.user.title')).toBeVisible();
  await expect(page.getByTestId('app.user.info.name.value')).toContainText(user.name);
  await expect(page.getByTestId('app.user.info.surname.value')).toContainText(user.familyName);

  await expect(page.getByTestId('app.user.info.identifier.value')).toContainText(user.fiscalCode);
  await expect(page.getByTestId('app.user.info.email.value')).toContainText(user.email);
});
