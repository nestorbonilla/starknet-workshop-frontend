import { test, expect } from '@playwright/test';

/**
 * Basic example of testing contract interaction
 * This test demonstrates:
 * 1. Reading contract state
 * 2. Interacting with contract
 * 3. Verifying state changes
 */
test('contract interaction flow', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:3000');

  // Check initial counter value
  const counterValue = page.getByTestId('counter-value');
  await expect(counterValue).toBeVisible();
  const initialValue = await counterValue.textContent();

  // Click increment button
  const incrementButton = page.getByRole('button', { name: /increment/i });
  await incrementButton.click();

  // Verify counter increased
  const newValue = await counterValue.textContent();
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
});
