import '../utils/env';
import { test, expect } from '../utils/fixtures';
import { SELECTORS } from '../utils/selectors';

const TRANSFER_LIST_PATH = 'default/transferlist';
const TRANSFER_CREATE_PATH = 'default/transfer';

const MOCK_TRANSFERS = {
  message: 'OK',
  transfers: [
    {
      value: 500,
      date: '2026-01-10',
      currency: 'USD',
      payeer: { document: '11223344', name: 'Carol White' },
    },
  ],
};

test.describe('Create transaction', () => {
  test.beforeEach(async ({ page }) => {
    const transferListUrl = `${process.env.VITE_API_URL_TRANSFER_LIST}/${TRANSFER_LIST_PATH}`;
    const transferCreateUrl = `${process.env.VITE_API_URL_TRANSFER}/${TRANSFER_CREATE_PATH}`;

    await page.route(transferListUrl, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_TRANSFERS),
      }),
    );

    await page.route(transferCreateUrl, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Transfer created',
        }),
      }),
    );

    await page.goto('/transactions');
    await expect(page.getByTestId(SELECTORS.transactionsTable)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('submitting empty form shows validation errors and keeps dialog open', async ({
    page,
  }) => {
    await page.getByTestId(SELECTORS.createNewTransaction).click();
    await expect(
      page.getByTestId(SELECTORS.transactionsConfiguration),
    ).toBeVisible();

    await page.getByTestId(SELECTORS.saveTransaction).click();

    await expect(
      page.getByTestId(SELECTORS.transactionsConfiguration),
    ).toBeVisible();
    await expect(page.getByText('Value is required')).toBeVisible();
  });

  test('immediate transfer appears in table after successful creation', async ({
    page,
    freshTransfer,
  }) => {
    await page.getByTestId(SELECTORS.createNewTransaction).click();

    const dialog = page.getByTestId(SELECTORS.transactionsConfiguration);
    await dialog
      .getByTestId('value-input')
      .fill(freshTransfer.value.toString());
    await dialog.getByTestId('currency-input').fill(freshTransfer.currency);
    await dialog.getByTestId('payeer-input').fill(freshTransfer.payeerDocument);

    await dialog.getByTestId(SELECTORS.saveTransaction).click();

    await expect(
      page.getByTestId(SELECTORS.transactionsConfiguration),
    ).not.toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId(SELECTORS.transactionsTable)).toBeVisible();
    await expect(page.getByText(freshTransfer.payeerDocument)).toBeVisible();
  });

  test('scheduled transfer with future date appears in table', async ({
    page,
    freshTransfer,
  }) => {
    await page.getByTestId(SELECTORS.createNewTransaction).click();

    const dialog = page.getByTestId(SELECTORS.transactionsConfiguration);
    await dialog
      .getByTestId('value-input')
      .fill(freshTransfer.value.toString());
    await dialog.getByTestId('currency-input').fill(freshTransfer.currency);
    await dialog.getByTestId('payeer-input').fill(freshTransfer.payeerDocument);

    await dialog.getByTestId('programmed-transfer-checkbox').click();
    await dialog
      .getByTestId('transfer-date-input')
      .fill(freshTransfer.transferDate);

    await dialog.getByTestId(SELECTORS.saveTransaction).click();

    await expect(
      page.getByTestId(SELECTORS.transactionsConfiguration),
    ).not.toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(freshTransfer.payeerDocument)).toBeVisible();
  });
});
