import type { TransferListResponse } from '@/services/transfer/types';

export type TransactionsTableProps = {
  transfers: TransferListResponse['transfers'];
};
