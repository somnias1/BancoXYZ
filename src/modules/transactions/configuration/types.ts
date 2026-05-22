import type { TransactionValues } from './schema';

export type TransactionsConfigurationProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: TransactionValues) => void;
};
