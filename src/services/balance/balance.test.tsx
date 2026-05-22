import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { config } from '@/config';
import { server } from '@/mocks/server';
import { createWrapper } from '@/utils/test/utils/wrapper';
import { routes } from '@/routes';
import { balancePaths } from './constants';
import { BalanceMock } from './mocks';
import { useGetBalance } from '.';

const BALANCE_URL = `${config.apiURLs.balance}/${balancePaths.get}`;

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('useGetBalance', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should return the balance', async () => {
    const mockResponse = BalanceMock();
    server.use(http.get(BALANCE_URL, () => HttpResponse.json(mockResponse)));

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper({ cookies: { userToken: 'userToken' } }),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should redirect to logout if user is not authenticated', async () => {
    server.use(
      http.get(BALANCE_URL, () => new HttpResponse(null, { status: 401 })),
    );

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedNavigate).toHaveBeenCalledWith(routes.logout);
  });
});
