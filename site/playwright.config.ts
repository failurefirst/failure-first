import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/surface',
  outputDir: './test-results/surface',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.SURFACE_BASE_URL || 'http://127.0.0.1:4322',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: process.env.SURFACE_BASE_URL ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
