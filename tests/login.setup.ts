import { test as setup, expect } from '@playwright/test';
import { skipAuth, userPath } from '../utils';
import path from 'path';

const authFile = path.join(__dirname, `../${userPath}`);

setup("[E2E-ARC-1]Come Cittadino voglio autenticarmi nell' Area Riservata Cittadino per poter usufruire dei servizi offerti", async ({ page }) => {
  setup.skip(await skipAuth(), 'Non è necessario autenticarsi più volte, sopratutto durante le fasi di sviluppo e debug');
  
  const username = process.env?.USERNAME;
	const password = process.env?.PASSWORD;
	expect(username).toBeTruthy();
	expect(password).toBeTruthy();

	if(username && password) {
		await page.goto('/');
		await page.goto('/pagamenti/login');
		await page.getByRole('button', { name: 'Accetta tutti' }).click();
		await page.getByLabel('Accedi').click();
		await page.getByRole('button', { name: 'Entra con SPID' }).click();
		await page.getByLabel('demo', { exact: true }).click();
		await page.waitForURL('**/start');
		await expect(page.locator('#username')).toBeVisible({ timeout: 20000 });
		await page.locator('#username').click();
		await page.locator('#username').fill(username);
		await page.locator('#username').press('Tab');
		await page.getByLabel('Password').fill(password);
		await page.getByRole('button', { name: 'Entra con SPID' }).click();
		await page.getByRole('button', { name: 'Conferma' }).click();
		await page.waitForURL('**/pagamenti/');
		await expect(page.getByLabel('app.dashboard.greeting')).toBeVisible();
		const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
		expect(accessToken).toBeTruthy();

		// storing user contex
		await page.context().storageState({ path: authFile });
	}

});
