import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';   // agar config mein pehle se dotenv load nahi hota

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: reporters,
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
  
const reporters: ReporterDescription[] = [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['./reporters/ai-rca-reporter.ts'],
  ],
  if (process.env.OPENAI_API_KEY) {
  reporters.push(['./reporters/ai-rca-reporter.ts']);
} else {
  console.warn('OPENAI_API_KEY not set — AI RCA reporter disabled for this run.');
}
});
