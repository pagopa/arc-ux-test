// eslint.config.mjs
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import playwright from 'eslint-plugin-playwright';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'], // Lint TypeScript files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020, // Support modern ECMAScript features
        sourceType: 'module', // Use ES modules
      },
      globals: {
        process: 'readonly', // Node.js global variables like process
        localStorage: 'readonly', // Browser global like localStorage
        window: 'readonly', // Browser global like window
        document: 'readonly', // Browser global like document
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'playwright/no-focused-test': 'error', // Example Playwright rule
    },
  },
  {
    files: ['tests/**/*.ts'], // Playwright test files
    rules: {
      // Override or add test-specific rules if needed
    },
  },
];
