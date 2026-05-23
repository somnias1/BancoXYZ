import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [
        '**/auth/login.spec.ts',
        '**/auth/route-protection.spec.ts',
        '**/*.setup.ts',
      ],
    },
    {
      name: 'unauthenticated',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        '**/auth/login.spec.ts',
        '**/auth/route-protection.spec.ts',
      ],
    },
  ],
  webServer: {
    command: 'npm run dev:e2e',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
