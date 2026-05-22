import { createWrapper } from '@/utils/test/utils/wrapper';
import TransactionsList from '.';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { config } from '@/config';
import { transferPaths } from '@/services/transfer/constants';
import { TransferListMock } from '@/services/transfer/mocks';
import { formatDate } from '@/utils/general';

const TRANSFER_LIST_URL = `${config.apiURLs.transferList}/${transferPaths.list}`;

describe('TransactionsList', () => {
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
});
