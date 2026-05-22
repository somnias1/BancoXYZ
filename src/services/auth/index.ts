import useCallbackApi from '@/utils/callbackApi';
import type { LoginRequest, LoginResponse } from './types';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { authPaths } from './constants';

import { config } from '@/config';
import type { AxiosError } from 'axios';

export function useLogin(
  options?: Partial<
    UseMutationOptions<
      LoginResponse,
      Error & AxiosError<LoginResponse> & { data: string },
      LoginRequest
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      callbackApi<LoginResponse>(authPaths.login, {
        method: 'POST',
        data,
        baseURL: config.apiURLs.auth,
        skipAuthRedirect: true,
      }),
    ...options,
  });
}
