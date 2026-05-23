import { test, expect } from '@playwright/test';

test.describe('Route protection', () => {
  test('unauthenticated access to dashboard redirects to login', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('unauthenticated access to transactions redirects to login', async ({
    page,
  }) => {
    await page.goto('/transactions');
    await expect(page).toHaveURL('/login');
  });
});
