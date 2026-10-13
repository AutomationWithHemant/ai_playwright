import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  webServer: {
    command: 'node demo-app/server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['./reporters/ai-rca-reporter.ts'],
  ],
});
