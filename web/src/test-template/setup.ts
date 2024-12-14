import { test as base } from '@playwright/test';

/**
 * Basic test setup for Starknet dApp testing
 * Extends Playwright's test with common utilities
 */
export const test = base.extend({
  // Add your test extensions here
  page: async ({ page }, use) => {
    // Go to app before each test
    await page.goto('http://localhost:3000');
    await use(page);
  },
});
