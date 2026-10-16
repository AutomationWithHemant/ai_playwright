import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import * as allure from 'allure-js-commons';

const { Given, When, Then } = createBdd();

Given(
  'a registered user exists with username {string} and password {string}',
  async ({}, username: string, password: string) => {
    await allure.epic('Demo Store E2E');
    await allure.feature('User Authentication (BDD)');
    await allure.parameter('Registered Seed User', `${username} (${password})`);
  }
);

Given(
  'a locked user exists with username {string} and password {string}',
  async ({}, username: string, password: string) => {
    await allure.parameter('Locked Seed User', `${username} (${password})`);
  }
);

When(
  'the user attempts to log in with username {string} and password {string}',
  async ({ page }, username: string, password: string) => {
    // Map Gherkin example values (including AI-generated variations like validPass / validPassword) to demo-app/server.js credentials
    const mappedUser =
      username === 'validUser' ? 'standard_user' :
      username === 'lockedUser' ? 'locked_out_user' : username;
    const mappedPass =
      ['validPass', 'validPassword', 'anyPass', 'anyPassword'].includes(password)
        ? 'secret_sauce'
        : password;

    await allure.step(`Navigate to /login and submit credentials for "${username || '<empty>'}"`, async () => {
      await page.goto('/login');
      await page.locator('#user-name').fill(mappedUser);
      await page.locator('#password').fill(mappedPass);
      await page.locator('#login-button').click();
    });
  }
);

Then('the user should see {string}', async ({ page }, expectedMessage: string) => {
  if (expectedMessage === 'Products page is displayed') {
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  } else {
    const errorBox = page.locator('#error');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(expectedMessage);
  }
});