import { createWrapper } from '@/utils/test/utils/wrapper';
import TransactionsList from '.';
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { config } from '@/config';
import { transferPaths } from '@/services/transfer/constants';
import { TransferListMock } from '@/services/transfer/mocks';
import { formatDate } from '@/utils/general';
import type { TransferRequest } from '@/services/transfer/types';
import { faker } from '@faker-js/faker';
import { useTransactionsStore } from '../store/store';

const TRANSFER_LIST_URL = `${config.apiURLs.transferList}/${transferPaths.list}`;
const CREATE_TRANSFER_URL = `${config.apiURLs.transfer}/${transferPaths.create}`;

describe('TransactionsList', () => {
  beforeEach(() => {
    useTransactionsStore.setState({ transactions: [] });
  });
  it('should render error, loading and empty states', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(
        TRANSFER_LIST_URL,
        () => new HttpResponse(null, { status: 400 }),
      ),
    );

    render(
      createWrapper({ cookies: { userToken: 'userToken' } })({
        children: <TransactionsList />,
      }),
    );

    await waitFor(() =>
      expect(screen.getByTestId('loading-transactions')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByTestId('error-transactions')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    server.use(
      http.get(TRANSFER_LIST_URL, () =>
        HttpResponse.json(TransferListMock({ transfers: [] })),
      ),
    );
    await user.click(screen.getByTestId('retry-button'));
    await waitFor(() =>
      expect(screen.getByTestId('empty-transactions')).toBeInTheDocument(),
    );
    expect(screen.getByText('No transfers found')).toBeInTheDocument();
  });
  it('should render transactions table, apply filters and clear filters', async () => {
    const user = userEvent.setup();
    const mockTransfers = TransferListMock();
    server.use(
      http.get(TRANSFER_LIST_URL, () => HttpResponse.json(mockTransfers)),
    );
    render(
      createWrapper({ cookies: { userToken: 'userToken' } })({
        children: <TransactionsList />,
      }),
    );
    await waitFor(() =>
      expect(screen.getByTestId('transactions-table')).toBeInTheDocument(),
    );
    await user.type(
      screen.getByTestId('filter-payeer'),
      mockTransfers.transfers[0].payeer.name,
    );
    await waitFor(() =>
      expect(
        screen.getByText(mockTransfers.transfers[0].payeer.name),
      ).toBeInTheDocument(),
    );
    await user.click(screen.getByTestId('clear-filters'));
    await user.type(
      screen.getByTestId('filter-date'),
      mockTransfers.transfers[0].date,
    );
    await waitFor(() =>
      expect(
        screen.getAllByText(formatDate(mockTransfers.transfers[0].date))[0],
      ).toBeInTheDocument(),
    );
    await user.click(screen.getByTestId('clear-filters'));
    await user.type(
      screen.getByTestId('filter-value'),
      mockTransfers.transfers[0].value.toString(),
    );

    await user.click(screen.getByTestId('clear-filters'));
    await waitFor(() => {
      expect(screen.queryByTestId('clear-filters')).toBeNull();
    });
  });
  it('should create and push transaction to the table', async () => {
    const user = userEvent.setup();
    const newTransfer: TransferRequest = {
      value: faker.number.int(),
      currency: faker.finance.currencyCode(),
      payeerDocument: faker.finance.accountNumber(),
      transferDate: faker.date.soon().toISOString().split('T')[0],
    };
    const mockTransfers = TransferListMock();
    server.use(
      http.get(TRANSFER_LIST_URL, () => HttpResponse.json(mockTransfers)),
    );
    server.use(
      http.post(CREATE_TRANSFER_URL, () =>
        HttpResponse.json({ status: 'success' }),
      ),
    );
    render(
      createWrapper({ cookies: { userToken: 'userToken' } })({
        children: <TransactionsList />,
      }),
    );
    await waitFor(() =>
      expect(screen.getByTestId('transactions-table')).toBeInTheDocument(),
    );
    await user.click(screen.getByTestId('create-new-transaction'));
    await user.click(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'save-transaction',
      ),
    );
    await user.type(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'value-input',
      ),
      newTransfer.value.toString(),
    );
    await user.type(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'currency-input',
      ),
      newTransfer.currency,
    );
    await user.type(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'payeer-input',
      ),
      newTransfer.payeerDocument,
    );
    await user.click(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'programmed-transfer-checkbox',
      ),
    );
    fireEvent.change(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'transfer-date-input',
      ),
      { target: { value: newTransfer.transferDate } },
    );
    await user.click(
      within(screen.getByTestId('transactions-configuration')).getByTestId(
        'save-transaction',
      ),
    );
    await waitFor(() =>
      expect(screen.queryByTestId('transactions-configuration')).toBeNull(),
    );
    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    expect(screen.getByText(newTransfer.payeerDocument)).toBeInTheDocument();
  });
});
