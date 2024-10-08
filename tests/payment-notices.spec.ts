import { test, expect, Page } from '@playwright/test';

// Annotate entire file as serial.
test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => { page = await browser.newPage(); });
test.afterAll(async () => { await page.close(); });

test(`[E2E-ARC-5] Come Cittadino voglio accedere alla lista degli avvisi da pagare`, async () => {
  await page.goto('/pagamenti/payment-notices/');
  await expect(page).toHaveURL('/pagamenti/payment-notices/');
  await expect(page.getByRole('button').getByText('Cerca i tuoi avvisi')).toBeVisible();
  await page.getByRole('button').getByText('Cerca i tuoi avvisi').click();

  const responsePromise = page.waitForResponse('**/arc/v1/payment-notices');

  // wait for modal and click on the cta button
  await expect(page.locator('#pull-payments-modal .MuiPaper-root')).toBeVisible();
  await page.locator('#pull-payments-modal button').getByText('Consenti').click();
  const response = await responsePromise.then(response => response.json());

  // test if session storage var is filled
  const OPTIN = await page.evaluate((val) => sessionStorage.getItem('OPTIN'));
  await expect(OPTIN).toBeTruthy();
  // wait for the list of payment notices
  await expect(page.getByRole('listbox')).toBeVisible({timeout: 10000});
  const optionsListItemsCount = await page.getByRole('option').count();
  await expect(optionsListItemsCount).toBeGreaterThan(0);

  // saving info of the first item
  const responseFirstItem = response['paymentNotices'][0];
  // select the first item of the list showed
  const listFirstItem = await page.getByRole('option').first();

  // DATA CHECKS
  await expect(listFirstItem.locator('h1')).toBeVisible();
  await expect(listFirstItem.locator('h2')).toBeVisible();
  await expect(listFirstItem.getByRole('button')).toBeVisible();
  await listFirstItem.getByRole('button').click();
  await expect(page).toHaveURL(`/pagamenti/payment-notices/${responseFirstItem.iupd}`);

});

test(`[E2E-ARC-6] Come Cittadino voglio accedere al dettaglio di un avviso di pagamento`, async () => {
  // get data from sessionStorage
  const paymentNotice = await page.evaluate((val) => sessionStorage.getItem('paymentNotice'));
  const paymentNoticeJson = JSON.parse(paymentNotice || "");
  // checks value on the page
  const amountElCount = await page.locator("dd").getByText(paymentNoticeJson.paymentOptions.installments.amount).count();
  await expect(amountElCount).toBe(2);
  await expect(page.locator("dd").getByText(paymentNoticeJson.paymentOptions.installments.paFullName)).toBeVisible();
  await expect(page.locator("dd").getByText(paymentNoticeJson.paymentOptions.installments.description)).toBeVisible();
  await expect(page.locator("dd").getByText(paymentNoticeJson.paymentOptions.installments.iuv)).toBeVisible();
  await expect(page.locator("dd").getByText(paymentNoticeJson.paymentOptions.installments.paTaxCode)).toBeVisible();
  await expect(page.getByRole("button").getByText("Paga ora")).toBeEnabled();;
});

test(`[E2E-ARC-5B] Come Cittadino voglio accedere alla lista degli avvisi da pagare, ma si verifca un errore`, async () => {
  // causing a error when requesting payment notices items
  await page.route('**/arc/v1/payment-notices', route => route.abort());

  await page.goBack();
  await expect(page).toHaveURL('/pagamenti/payment-notices/');
  
  // test if session storage var is filled
  const OPTIN = await page.evaluate(() => sessionStorage.getItem('OPTIN'));
  expect(OPTIN).toBeTruthy();

  // waiting for retries ending
  await page.waitForTimeout(1000*10);
  expect(page.getByText('Non riusciamo a recuperare i dati a causa di un problema.')).toBeVisible();

  // clearing abort
  await page.unroute('**/arc/v1/payment-notices');
  await page.getByRole("button").getByText("Riprova").click();
  await page.waitForTimeout(1000*10);

  // wait for the list of payment notices assuming that by now the API works
  await expect(page.getByRole('listbox')).toBeVisible();
  const optionsListItemsCount = await page.getByRole('option').count();
  expect(optionsListItemsCount).toBeGreaterThan(0);
});

test(`E2E-ARC-5C] Come Cittadino voglio accedere alla lista degli avvisi da pagare in modo da poter avere una visione sintetica e d’insieme, non ottengo alcun errore, ma non ho avvisi associati.`, async () => {
  const emptyMessage = "Non abbiamo trovato avvisi da pagare";
  // reset mock
  await page.unroute('**/arc/v1/payment-notices');
  // override response setting an empty array
  await page.route('**/arc/v1/payment-notices', async route => {
    const json = { paymentNotices: []};
    await route.fulfill({ json });
  });
  // reload
  page.reload();
  // test
  await expect(page).toHaveURL('/pagamenti/payment-notices/');
  await expect(page.getByText(emptyMessage)).toBeVisible({timeout: 10000});
});