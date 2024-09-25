import fs from 'fs';
import { Page } from '@playwright/test';

/** 'LOCAL' | 'DEV' | 'UAT' */
export type ENVIRONMENT = 'LOCAL' | 'DEV' | 'UAT';
export const ENVIRONMENTDEFAULT = 'LOCAL'
export const userPath = 'auth/user.json';

const ENVIRONMENT: ENVIRONMENT = process.env.ENVIRONMENT as ENVIRONMENT || ENVIRONMENTDEFAULT;

// Auth phase can be skipped when the ENVIRONMENT === 'LOCAL' and a user.json file exists
// please delete the user.json file when the user's info are outdated (token expired)
export const skipAuth = (): boolean => ENVIRONMENT === 'LOCAL' && fs.existsSync(userPath);


// Helper function to wait for the fulfilled response
export async function getFulfilledResponse(page: Page, path: string) {
  const response = await page.waitForResponse(async (response) => {
    if (!response.url().includes(path)) return false;
    return true
  });
  return response.json();
}

export function isValidDate(d: string) {
  const date = new Date(d);
  // If the date object is invalid it
  // will return 'NaN' on getTime()
  // and NaN is never equal to itself
  return date.getTime() === date.getTime();
}
