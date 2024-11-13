import { test, expect, Page } from '@playwright/test';

// Annotate entire file as serial.
test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});
test.afterAll(async () => {
  await page.close();
});

test(`[E2E-ARC-5] Come Cittadino voglio accedere alla lista degli avvisi da pagare`, async () => {
  await page.goto('/pagamenti/payment-notices/');
  await expect(page).toHaveURL('/pagamenti/payment-notices/');
  await expect(page.locator('#searchButtonPaymentNotices')).toBeVisible();
  await page.locator('#searchButtonPaymentNotices').click();

  const responsePromise = page.waitForResponse('**/arc/v1/payment-notices');

  // wait for modal and click on the cta button
  await expect(page.locator('#pull-payments-modal .MuiPaper-root')).toBeVisible();
  await page.locator('#pull-payments-modal-ok').click();
  const response = await responsePromise.then((response) => response.json());

  // test if session storage var is filled
  const OPTIN = await page.evaluate(() => sessionStorage.getItem('OPTIN'));
  expect(OPTIN).toBeTruthy();
  // wait for the list of payment notices
  await expect(page.locator('#payment-notices-list')).toBeVisible({ timeout: 10000 });
  const optionsListItemsCount = await page.getByTestId('payment-notices-item').count();
  expect(optionsListItemsCount).toBeGreaterThan(0);

  // saving info of the first item
  const responseFirstItem = response['paymentNotices'][0];
  // select the first item of the list showed
  const listFirstItem = page.getByTestId('payment-notices-item').first();

  // DATA CHECKS
  await expect(listFirstItem.locator('h1')).toBeVisible();
  await expect(listFirstItem.locator('h2')).toBeVisible();
  await expect(listFirstItem.getByTestId('payment-notices-item-cta')).toBeVisible();
  await listFirstItem.getByTestId('payment-notices-item-cta').click();
  await expect(page).toHaveURL(`/pagamenti/payment-notices/${responseFirstItem.iupd}`);
});

test(`[E2E-ARC-6] Come Cittadino voglio accedere al dettaglio di un avviso di pagamento`, async () => {
  // get data from sessionStorage
  const paymentNotice = await page.evaluate(() => sessionStorage.getItem('paymentNotice'));
  const paymentNoticeJson = JSON.parse(paymentNotice || '');
  // checks value on the page
  await expect(page.getByTestId('app.paymentNoticeDetail.amount').locator('dd')).toHaveText(
    paymentNoticeJson.paymentOptions.installments.amount
  );
  await expect(page.getByTestId('app.paymentNoticeDetail.paFullname').locator('dd')).toHaveText(
    paymentNoticeJson.paymentOptions.installments.paFullName
  );
  await expect(page.getByTestId('app.paymentNoticeDetail.subject').locator('dd')).toHaveText(
    paymentNoticeJson.paymentOptions.installments.description
  );
  await expect(page.getByTestId('app.paymentNoticeDetail.iuv').locator('dd')).toHaveText(
    paymentNoticeJson.paymentOptions.installments.iuv
  );
  await expect(page.getByTestId('app.paymentNoticeDetail.paTaxCode').locator('dd')).toHaveText(
    paymentNoticeJson.paymentOptions.installments.paTaxCode
  );

  await expect(page.locator('#payment-notice-pay-button')).toBeEnabled();
});

test(`[E2E-ARC-7] Come Cittadino voglio poter avviare il pagamento di un avviso`, async () => {
  // get data from sessionStorage
  const paymentNotice = await page.evaluate(() => sessionStorage.getItem('paymentNotice'));
  const paymentNoticeJson = JSON.parse(paymentNotice || '');
  const amount = paymentNoticeJson.paymentOptions.installments.amount;
  // click to pay
  await page.locator('#payment-notice-pay-button').click();
  // wait for checkout
  await expect(page).toHaveURL(new RegExp('checkout.pagopa.it/'));
  // test on checkout side
  await expect(page.locator('#email')).toBeVisible({ timeout: 10000 });
  // test if the car button as the same amount of the payment notice
  await expect(page.getByRole('button').getByText(amount)).toBeVisible();
});

test(`[E2E-ARC-5B] Come Cittadino voglio accedere alla lista degli avvisi da pagare, ma si verifca un errore`, async () => {
  // causing a error when requesting payment notices items
  await page.route('**/arc/v1/payment-notices', (route) => route.abort());

  await page.goto('/pagamenti/payment-notices/');
  await expect(page).toHaveURL('/pagamenti/payment-notices/');

  // test if session storage var is filled
  const OPTIN = await page.evaluate(() => sessionStorage.getItem('OPTIN'));
  expect(OPTIN).toBeTruthy();

  // waiting for retries ending
  await page.waitForTimeout(1000 * 10);
  expect(page.getByTestId('app.transactions.error')).toBeVisible();

  // clearing abort
  await page.unroute('**/arc/v1/payment-notices');
  await page.getByTestId('app.paymentNotice.error.button').click();
  await page.waitForTimeout(1000 * 10);

  // wait for the list of payment notices assuming that by now the API works
  await expect(page.locator('#payment-notices-list')).toBeVisible();
  const optionsListItemsCount = await page.getByTestId('payment-notices-item').count();
  expect(optionsListItemsCount).toBeGreaterThan(0);
});

test(`E2E-ARC-5C] Come Cittadino voglio accedere alla lista degli avvisi da pagare in modo da poter avere una visione sintetica e d’insieme, non ottengo alcun errore, ma non ho avvisi associati.`, async () => {
  // reset mock
  await page.unroute('**/arc/v1/payment-notices');
  // override response setting an empty array
  await page.route('**/arc/v1/payment-notices', async (route) => {
    const json = { paymentNotices: [] };
    await route.fulfill({ json });
  });
  // reload
  page.reload();
  // test
  await expect(page).toHaveURL('/pagamenti/payment-notices/');
  await expect(page.getByTestId('app.paymentNotice.empty')).toBeVisible({ timeout: 10000 });
});
