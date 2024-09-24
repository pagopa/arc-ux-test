import { test, expect } from '@playwright/test';
import { getFulfilledResponse } from '../utils';

test("[E2E-ARC-9] Come Cittadino voglio accedere alla pagina di dettaglio di una ricevuta in modo da poter consultare tutte le informazioni disponibili", async ({ page }) => {
	await page.goto('/pagamenti/');
  //await expect(page).toHaveURL('/pagamenti/')
  const listResponseBody = await getFulfilledResponse(page, 'arc/v1/transactions');

  //saving info of the first item
  const listItem = listResponseBody.transactions[0];
  //const { amount, payeeName, transactionDate, transactionId } = transaction;
  console.log(listItem);

  // click on first row item
  page.locator("table[aria-label='Storico table'] > tbody > tr").nth(0).click();
  await expect(page).toHaveURL(`/pagamenti/transactions/${listItem.transactionId}`);

  const { infoTransaction: transaction, carts } = await getFulfilledResponse(page, `arc/v1/transactions/${listItem.transactionId}`);
  console.log(transaction, carts[0]);

  // data checks
  expect(listItem.transactionId === transaction.transactionId).toBeTruthy();
  expect(listItem.amount === transaction.amount).toBeTruthy();
  expect(listItem.transactionDate === transaction.transactionDate).toBeTruthy();
  expect(listItem.transactionDate === transaction.transactionDate).toBeTruthy();

  // assuming a single cart item, needs an update when we will manage multi carts item
  expect(listItem.payeeName === carts[0].payee.name).toBeTruthy();

  // PAGE INFO CHECKS

  // CART
  // payee Name
  await expect(page.getByText(carts[0].payee.name)).toBeVisible();
  // payee taxt code
  await expect(page.getByText(carts[0].payee.taxCode)).toBeVisible();
  // recepits code
  await expect(page.getByText(carts[0].refNumberValue)).toBeVisible();


  // TRANSACTION
  // psp name
  await expect(page.getByText(transaction.pspName, { exact: true })).toBeVisible();
  // rrn
  await expect(page.getByText(transaction.rrn)).toBeVisible();
  // transactionId
  const transactionIdSubstring = transaction.transactionId.substring(0,7)
  await expect(page.getByText(new RegExp(`${transactionIdSubstring}`))).toBeVisible();

});
