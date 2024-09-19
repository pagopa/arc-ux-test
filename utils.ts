import fs from 'fs';

/** 'LOCAL' | 'DEV' | 'UAT' */
export type ENVIRONMENT = 'LOCAL' | 'DEV' | 'UAT';
export const ENVIRONMENTDEFAULT = 'LOCAL'
export const userPath = 'auth/user.json';

const ENVIRONMENT: ENVIRONMENT = process.env.ENVIRONMENT as ENVIRONMENT || ENVIRONMENTDEFAULT;

// Auth phase can be skipped when the ENVIRONMENT === 'LOCAL' and a user.json file is missing
// please delete the user.json file when the user's info are outdated (token expired)
export const skipAuth = (): boolean => ENVIRONMENT === 'LOCAL' && fs.existsSync(userPath);
