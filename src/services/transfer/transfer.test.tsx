import { act, renderHook, waitFor } from '@testing-library/react';
import { useCreateTransfer, useGetTransferList } from '.';
import { createWrapper } from '@/utils/test/utils/wrapper';
import type { TransferRequest } from './types';
import { faker } from '@faker-js/faker';
import { config } from '@/config';

import { transferPaths } from './constants';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { TransferListMock } from './mocks';

const CREATE_TRANSFER_URL = `${config.apiURLs.transfer}/${transferPaths.create}`;
const TRANSFER_LIST_URL = `${config.apiURLs.transferList}/${transferPaths.list}`;

describe('useCreateTransfer', () => {
  it('should create a transfer', async () => {
    server.use(
      http.post(CREATE_TRANSFER_URL, () =>
        HttpResponse.json({ status: 'success' }),
      ),
    );
    const wrapper = createWrapper({ cookies: { userToken: 'userToken' } });
    const request: TransferRequest = {
      value: faker.number.int(),
      currency: faker.finance.currencyCode(),
      payeerDocument: faker.finance.accountNumber(),
      transferDate: faker.date.recent().toISOString(),
    };
    const { result } = renderHook(() => useCreateTransfer(), { wrapper });
    act(() => {
      result.current.mutate(request);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ status: 'success' });
  });

  it('should fail with an error', async () => {
    server.use(
      http.post(
        CREATE_TRANSFER_URL,
        () => new HttpResponse(null, { status: 400 }),
      ),
    );
    const request: TransferRequest = {
      value: faker.number.int(),
      currency: faker.finance.currencyCode(),
      payeerDocument: faker.finance.accountNumber(),
      transferDate: faker.date.recent().toISOString(),
    };
    const wrapper = createWrapper({ cookies: { userToken: 'userToken' } });
    const { result } = renderHook(() => useCreateTransfer(), { wrapper });
    act(() => {
      result.current.mutate(request);
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});

describe('useGetTransferList', () => {
  it('should return the transfer list', async () => {
    const mockResponse = TransferListMock();
    server.use(
      http.get(TRANSFER_LIST_URL, () => HttpResponse.json(mockResponse)),
    );
    const wrapper = createWrapper({ cookies: { userToken: 'userToken' } });
    const { result } = renderHook(() => useGetTransferList(), { wrapper });
    act(() => {
      result.current.refetch();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });
});
