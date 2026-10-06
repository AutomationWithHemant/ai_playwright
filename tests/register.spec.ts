// Module 1.1 - tests driven by AI-generated, reviewed, committed data
import { test, expect } from '@playwright/test';
import fs from 'fs';
import type { User } from '../data/ai-data';

const users: User[] = JSON.parse(fs.readFileSync('test-data/users.json', 'utf8'));

for (const u of users) {
  test(`register ${u.email}`, async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('First name').fill(u.firstName);
    await page.getByLabel('Last name').fill(u.lastName);
    await page.getByLabel('Email').fill(u.email);
    await page.getByLabel('Phone').fill(u.phone);
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText('Account created')).toBeVisible();
  });
}
