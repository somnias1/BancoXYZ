import { test, expect } from '@playwright/test';
import { SELECTORS } from '../utils/selectors';

test.describe('Logout', () => {
  test('navigating to /logout clears auth and protected routes redirect to login', async ({
    page,
  }) => {
    await page.goto('/logout');

    await expect(page.getByTestId(SELECTORS.loginButton)).toBeVisible();

    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });
});
