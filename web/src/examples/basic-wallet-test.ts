import { test, expect } from '@playwright/test';

/**
 * Basic example of testing wallet connection
 * This test demonstrates:
 * 1. Finding and clicking the connect button
 * 2. Checking if wallet options appear
 */
test('basic wallet connection flow', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:3000');

  // Find and click connect button
  const connectButton = page.getByRole('button', { name: /connect/i });
  await connectButton.click();

  // Check if wallet options appear
  const argentX = page.getByText('ArgentX');
  const braavos = page.getByText('Braavos');
  
  await expect(argentX).toBeVisible();
  await expect(braavos).toBeVisible();
});
