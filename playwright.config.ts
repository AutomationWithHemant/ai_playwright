import 'dotenv/config';
import { defineConfig, devices, type ReporterDescription } from '@playwright/test';

// 1. Reporter list config ke BAHAR banti hai
const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'results.json' }],
  ['junit', { outputFile: 'reports/junit.xml' }],
];

if (process.env.OPENAI_API_KEY) {
  reporters.push(['./reporters/ai-rca-reporter.ts']);
} else {
  console.warn('OPENAI_API_KEY not set — AI RCA reporter disabled for this run.');
}

// 2. Config ke ANDAR sirf key: value
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
  reporter: reporters,
});
