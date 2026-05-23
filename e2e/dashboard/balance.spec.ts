import '../utils/env';
import { test, expect } from '@playwright/test';
import { SELECTORS } from '../utils/selectors';

const BALANCE_PATH = 'default/balance';
const MOCK_BALANCE = { accountBalance: 1500, currency: 'USD' };

test.describe('Dashboard balance', () => {
  test('balance section renders after successful fetch', async ({ page }) => {
    const balanceUrl = `${process.env.VITE_API_URL_BALANCE}/${BALANCE_PATH}`;

    await page.route(balanceUrl, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_BALANCE),
      }),
    );

    await page.goto('/');

    await expect(page.getByTestId(SELECTORS.balanceSection)).toBeVisible({
      timeout: 15_000,
    });

    const balanceText = await page
      .getByTestId(SELECTORS.balanceSection)
      .textContent();
    expect(balanceText?.trim().length).toBeGreaterThan(0);
  });

  test('error state appears on API failure and retry restores balance', async ({
    page,
  }) => {
    const balanceUrl = `${process.env.VITE_API_URL_BALANCE}/${BALANCE_PATH}`;

    await page.route(balanceUrl, (route) => route.fulfill({ status: 400 }));
    await page.goto('/');

    await expect(page.getByTestId(SELECTORS.errorBalance)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId(SELECTORS.retryButton)).toBeVisible();

    await page.route(balanceUrl, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_BALANCE),
      }),
    );
    await page.getByTestId(SELECTORS.retryButton).click();

    await expect(page.getByTestId(SELECTORS.balanceSection)).toBeVisible({
      timeout: 15_000,
    });
  });
});
