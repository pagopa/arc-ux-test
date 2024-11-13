import { test, expect } from '@playwright/test';
import userInfo from './userInfo.json';

test('my data test', async ({ page }) => {
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');

  await page.getByRole('button').getByText(`${userInfo.name} ${userInfo.cognome}`).click();
  await page.getByText('I tuoi dati').click();
  page.waitForURL('**/user');
  await expect(page.getByTestId('app.user.title')).toBeVisible();
  await expect(page.getByTestId('app.user.info.name.value')).toBeVisible();
  await expect(page.getByTestId('app.user.info.surname.value')).toBeVisible();

  await expect(page.getByTestId('app.user.info.identifier.value')).toBeVisible();
  await expect(page.getByTestId('app.user.info.email.value')).toBeVisible();
});
