import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '.';
import { createWrapper } from '@/utils/test/utils/wrapper';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { config } from '@/config';
import { balancePaths } from '@/services/balance/constants';
import { BalanceMock } from '@/services/balance/mocks';
import userEvent from '@testing-library/user-event';

const BALANCE_URL = `${config.apiURLs.balance}/${balancePaths.get}`;

describe('Dashboard', () => {
  it('should render error, loading and success states', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(BALANCE_URL, () => new HttpResponse(null, { status: 400 })),
    );

    render(
      createWrapper({ cookies: { userToken: 'userToken' } })({
        children: <Dashboard />,
      }),
    );

    await waitFor(() =>
      expect(screen.getByTestId('loading-balance')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByTestId('error-balance')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();

    server.use(http.get(BALANCE_URL, () => HttpResponse.json(BalanceMock())));

    await user.click(screen.getByTestId('retry-button'));

    await waitFor(() =>
      expect(screen.getByTestId('balance-section')).toBeInTheDocument(),
    );
  });
  it('should display the balance with an invalid currency', async () => {
    const mockResponse = BalanceMock({ currency: 'INVALID' });
    server.use(http.get(BALANCE_URL, () => HttpResponse.json(mockResponse)));
    render(
      createWrapper({ cookies: { userToken: 'userToken' } })({
        children: <Dashboard />,
      }),
    );
    await waitFor(() =>
      expect(screen.getByTestId('balance-section')).toBeInTheDocument(),
    );
    expect(
      screen.getByText(`Your configured currency is ${mockResponse.currency}`),
    ).toBeInTheDocument();
  });
});
