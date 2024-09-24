import { test, expect } from '@playwright/test';
import { userPath } from '../utils';
import fs from 'fs';

test('my data test', async ({ page }) => {
  
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/')
  const icon= page.getByTestId('AccountCircleRoundedIcon')
  const nome ="Marco";
  const cognome="Polo"

  //const responsePromise = page.waitForResponse(resp => resp.url().includes('https://api.dev.cittadini.pagopa.it/arc/v1/auth/user'));
  //const response = await responsePromise;
  const a = await page.getByRole("button").getByText("Marco Polo").click();
  const b = await page.getby.getByText("I tuoi dati").click();
   page.waitForURL('**/user');
   const c = await page.getByText("Marco").click();
   await expect(page.getByText("I tuoi dati")).toBeVisible();
   await expect(page.getByText("PLOMRC01P30L736Y")).toBeVisible();

  console.log(a)
  

  

});