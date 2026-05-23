import { test, expect } from '@playwright/test';

test.describe('Sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sidebar links navigate to each route', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });

    await nav.getByRole('link', { name: 'Transactions' }).click();
    await expect(page).toHaveURL('/transactions');

    await nav.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/');

    await nav.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/logout');
  });

  test('active link reflects current route with aria-current="page"', async ({
    page,
  }) => {
    await page.goto('/transactions');

    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(
      nav.getByRole('link', { name: 'Transactions' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      nav.getByRole('link', { name: 'Dashboard' }),
    ).not.toHaveAttribute('aria-current', 'page');
  });
});
