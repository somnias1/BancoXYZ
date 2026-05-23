import './utils/env';
import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_FILE = 'e2e/.auth/user.json';

setup('create authenticated session', async ({ page }) => {
  await page.context().addCookies([
    {
      name: 'userToken',
      value: 'e2e-session',
      domain: 'localhost',
      path: '/',
      sameSite: 'Lax',
    },
  ]);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
