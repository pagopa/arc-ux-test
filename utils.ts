import fs from 'fs';

/** 'LOCAL' | 'DEV' | 'UAT' */
export type ENVIRONMENT = 'LOCAL' | 'DEV' | 'UAT';
export const ENVIRONMENTDEFAULT = 'LOCAL'
export const userPath = 'auth/user.json';

const ENVIRONMENT: ENVIRONMENT = process.env.ENVIRONMENT as ENVIRONMENT || ENVIRONMENTDEFAULT;

// Auth phase can be skipped when the ENVIRONMENT === 'LOCAL' and a user.json file exists
// please delete the user.json file when the user's info are outdated (token expired)
export const skipAuth = (): boolean => ENVIRONMENT === 'LOCAL' && fs.existsSync(userPath);


// Helper function to wait for the fulfilled response
export async function getFulfilledResponse(page, path: string) {
  const response = await page.waitForResponse(async (response) => {
    if (!response.url().includes(path)) return false;
    // const body = await response.json();
    //return body.status === 'success';
    return true
  });
  return response.json();
}

export const toEuro = (amount: number, decimalDigits: number = 2, fractionDigits: number = 2): string =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount / Math.pow(10, decimalDigits));
