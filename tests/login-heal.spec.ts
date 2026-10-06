// Module 2 - self-healing demo.
// '#btn-login' is BROKEN on purpose (the real id is #login-button, as if a dev renamed it).
// Run: npm test -> test heals and passes -> npm run heal:apply -> see git diff.
// Run npm run demo:reset to show it again.
import { test, expect } from '@playwright/test';
import { healingLocator } from '../utils/self-heal';

test('login with self-healing locator', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  const loginBtn = await healingLocator(page, '#btn-login', 'Login button on the sign-in page');
  await loginBtn.click();
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});
