import { test, expect } from '@playwright/test';
import userInfo from './userInfo.json';

test('my data test', async ({ page }) => {
  
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/')

   await page.getByRole("button").getByText(`${userInfo.name} ${userInfo.cognome}`).click();
   await page.getByText("I tuoi dati").click();
   page.waitForURL('**/user');
   await expect(page.locator('h1:has-text("Your data")')).toBeVisible();
   await expect(page.locator(`div:has-text("${userInfo.name}")`).filter({hasNotText:"Assistenza"}).first()).toBeVisible();
   await expect(page.locator(`div:has-text("${userInfo.cognome}")`).filter({hasNotText:"Assistenza"}).first()).toBeVisible();

   await expect(page.getByText(userInfo.CF)).toBeVisible();
   await expect(page.getByText(userInfo.email)).toBeVisible();

  

  

});