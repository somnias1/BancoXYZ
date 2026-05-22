import { create } from 'zustand';
import type { TransactionsStore } from './types';
import type {
  TransferItem,
  TransferListResponse,
} from '@/services/transfer/types';

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  actions: {
    setTransactions: (transactions: TransferListResponse['transfers']) => {
      set({ transactions });
    },
    updateTransactions: (transaction) => {
      const newTransaction: TransferItem = {
        value: transaction.value,
        date: transaction.transferDate,
        currency: transaction.currency,
        payeer: {
          document: transaction.payeerDocument,
          name: transaction.payeerDocument,
        },
      };
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
      }));
    },
  },
}));
