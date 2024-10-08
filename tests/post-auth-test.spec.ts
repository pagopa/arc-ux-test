import { test, expect } from '@playwright/test';

// semplice test per verificare che lo stato settato dopo il setup sia disponibile
test('post auth test', async ({ page }) => {
  await page.goto('/pagamenti/');
  await expect(page).toHaveURL('/pagamenti/');
});
