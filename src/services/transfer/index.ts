import useCallbackApi from '@/utils/callbackApi';
import type {
  TransferListResponse,
  TransferRequest,
  TransferResponse,
} from './types';
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { transferPaths, transferQueryKey } from './constants';
import { config } from '@/config';

export function useCreateTransfer(
  options?: Partial<
    UseMutationOptions<TransferResponse, Error, TransferRequest>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation({
    mutationFn: (data: TransferRequest) =>
      callbackApi<TransferResponse>(transferPaths.create, {
        method: 'POST',
        data,
        baseURL: config.apiURLs.transfer,
      }),
    ...options,
  });
}

export function useGetTransferList(
  options?: Partial<UseQueryOptions<TransferListResponse, Error>>,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery({
    queryKey: [transferQueryKey],
    queryFn: () =>
      callbackApi<TransferListResponse>(transferPaths.list, {
        method: 'GET',
        baseURL: config.apiURLs.transferList,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
}
