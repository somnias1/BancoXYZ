import { useGetTransferList } from '@/services/transfer';
import { useEffect } from 'react';
import { useTransactionsStore } from './store';

export function useInitializeTransactionsStore() {
  const {
    data: transferListResponse,
    isLoading,
    isError,
    refetch,
    isSuccess,
  } = useGetTransferList();
  const { setTransactions } = useTransactionsStore((state) => state.actions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes transferListResponse
  useEffect(() => {
    if (transferListResponse) {
      setTransactions(transferListResponse.transfers);
    }
  }, [transferListResponse]);
  return {
    isLoading,
    isError,
    refetch,
    isSuccess,
  };
}
