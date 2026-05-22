import type { TransferListResponse } from '@/services/transfer/types';
import type { TransactionValues } from '../configuration/schema';

export type TransactionsStore = {
  transactions: TransferListResponse['transfers'];
  actions: {
    updateTransactions: (transaction: TransactionValues) => void;
    setTransactions: (transactions: TransferListResponse['transfers']) => void;
  };
};
