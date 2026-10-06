// Module 3 - these tests FAIL ON PURPOSE so the AI reporter can classify them.
// Run: npm run test:fail-demo  -> open ai-analysis.md
import { test, expect } from '@playwright/test';

test.setTimeout(10_000);

test('bad locator (expect: test-bug)', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').click({ timeout: 3000 });
});

test('wrong expectation (expect: product-bug)', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Products', { exact: true })).toHaveText('Products', { timeout: 3000 });
});

test('app unreachable (expect: environment)', async ({ page }) => {
  await page.goto('/');
});
