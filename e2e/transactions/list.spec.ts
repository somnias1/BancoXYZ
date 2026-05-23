import '../utils/env';
import { test, expect } from '@playwright/test';
import { SELECTORS } from '../utils/selectors';

const TRANSFER_LIST_PATH = 'default/transferlist';

const MOCK_TRANSFERS = {
  message: 'OK',
  transfers: [
    {
      value: 1500,
      date: '2026-01-15',
      currency: 'USD',
      payeer: { document: '12345678', name: 'Alice Johnson' },
    },
    {
      value: 800,
      date: '2026-01-20',
      currency: 'EUR',
      payeer: { document: '98765432', name: 'Bob Smith' },
    },
  ],
};

test.describe('Transactions list', () => {
  test.beforeEach(async ({ page }) => {
    const transferListUrl = `${process.env.VITE_API_URL_TRANSFER_LIST}/${TRANSFER_LIST_PATH}`;

    await page.route(transferListUrl, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_TRANSFERS),
      }),
    );

    await page.goto('/transactions');
    await expect(page.getByTestId(SELECTORS.transactionsTable)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('table renders with create button enabled', async ({ page }) => {
    await expect(
      page.getByTestId(SELECTORS.createNewTransaction),
    ).toBeEnabled();
  });

  test('filter by payeer name narrows visible rows', async ({ page }) => {
    const filterName = MOCK_TRANSFERS.transfers[0].payeer.name;

    await page.getByTestId(SELECTORS.filterPayeer).fill(filterName);

    const dataRows = page.locator(
      `[data-testid="${SELECTORS.transactionsTable}"] tbody tr:not([data-testid="empty-transactions"])`,
    );
    const count = await dataRows.count();
    for (let i = 0; i < count; i++) {
      await expect(dataRows.nth(i).locator('td:nth-child(2)')).toContainText(
        filterName,
      );
    }
  });

  test('clear filters removes filter button and resets inputs', async ({
    page,
  }) => {
    const filterName = MOCK_TRANSFERS.transfers[0].payeer.name;

    await page.getByTestId(SELECTORS.filterPayeer).fill(filterName);
    await expect(page.getByTestId(SELECTORS.clearFilters)).toBeVisible();

    await page.getByTestId(SELECTORS.clearFilters).click();

    await expect(page.getByTestId(SELECTORS.clearFilters)).not.toBeVisible();
    await expect(page.getByTestId(SELECTORS.filterPayeer)).toHaveValue('');
  });
});
