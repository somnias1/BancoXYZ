import { act, renderHook, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';
import { config } from '@/config';
import { server } from '@/mocks/server';
import { createWrapper } from '@/utils/test/utils/wrapper';
import { useLogin } from '.';
import { authPaths } from './constants';
import { LoginMock } from './mocks';

const LOGIN_URL = `${config.apiURLs.auth}/${authPaths.login}`;
const wrapper = createWrapper();

describe('useLogin', () => {
  it('should resolve with user data on successful login', async () => {
    const credentials = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const mockResponse = LoginMock({
      user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: credentials.email,
      },
    });

    server.use(http.post(LOGIN_URL, () => HttpResponse.json(mockResponse)));

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate(credentials);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should fail without redirecting on invalid credentials (401)', async () => {
    const credentials = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    server.use(
      http.post(LOGIN_URL, () => new HttpResponse(null, { status: 401 })),
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate(credentials);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
