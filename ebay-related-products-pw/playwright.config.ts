import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0, // Can be overridden via command line: --retries=7
  workers: 1, // Can be overridden via command line: --workers=7
  reporter: [['list'], ['html', { open: 'always' }]],
  use: {
    headless: true, // Can be overridden via command line: --headed
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});

