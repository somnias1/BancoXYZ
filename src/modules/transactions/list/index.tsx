import Button from '@/components/button/Button';
import Spinner from '@/components/spinner/Spinner';
import TextInput from '@/components/textInput/TextInput';
import TransactionsTable from '../table';
import { useCallback, useMemo, useState } from 'react';
import TransactionsConfiguration from '../configuration';
import type { TransactionValues } from '../configuration/schema';
import { useInitializeTransactionsStore } from '../store';
import { useTransactionsStore } from '../store/store';

export default function TransactionsList() {
  const { isLoading, isError, isSuccess, refetch } =
    useInitializeTransactionsStore();
  const transfers = useTransactionsStore((state) => state.transactions);
  const updateTransactions = useTransactionsStore(
    (state) => state.actions.updateTransactions,
  );
  const [displayTransactionDialog, setDisplayTransactionDialog] =
    useState(false);

  const handleCloseTransactionDialog = useCallback(() => {
    setDisplayTransactionDialog(false);
  }, []);

  const initialFilters = { payeer: '', date: '', value: '' };
  const [filters, setFilters] = useState(initialFilters);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const clearFilters = () => setFilters(initialFilters);

  const filteredTransfers = useMemo(() => {
    return (
      transfers.filter((transfer) => {
        const matchesPayeer =
          !filters.payeer ||
          transfer.payeer.name
            .toLowerCase()
            .includes(filters.payeer.toLowerCase().trim());
        const matchesDate =
          !filters.date ||
          transfer.date.slice(0, 10) === filters.date.slice(0, 10);
        const matchesValue =
          !filters.value ||
          transfer.value.toString().includes(filters.value.trim());

        return matchesPayeer && matchesDate && matchesValue;
      }) ?? []
    );
  }, [transfers, filters]);

  const handleSuccessTransactionCreation = useCallback(
    (values: TransactionValues) => {
      updateTransactions(values);
      setDisplayTransactionDialog(false);
    },
    [updateTransactions],
  );

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          data-testid="loading-transactions"
          className="flex flex-col items-center gap-2"
        >
          <p>Loading your transactions</p>
          <p className="text-sm text-gray-500">
            Please wait while we load your transactions
          </p>
          <Spinner />
        </div>
      )}
      {isError && (
        <div
          role="alert"
          aria-atomic="true"
          data-testid="error-transactions"
          className="flex flex-col items-center gap-2"
        >
          <p className="text-red-500">
            There was an error fetching the transactions
          </p>
          <Button
            variant="secondary"
            aria-label="Retry loading transactions"
            data-testid="retry-button"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      )}
      {isSuccess && (
        <div className="flex flex-col gap-4 items-center h-screen w-full p-4 m-4 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button
            onClick={() => setDisplayTransactionDialog(true)}
            aria-label="Create new transaction"
            data-testid="create-new-transaction"
          >
            Create new transaction
          </Button>
          <search
            aria-label="Filter transactions"
            className="flex flex-wrap gap-3 w-full items-end bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex-1 min-w-[160px]">
              <TextInput
                label="Payeer"
                placeholder="Search by name"
                value={filters.payeer}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    payeer: e.target.value,
                  }))
                }
                data-testid="filter-payeer"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <TextInput
                label="Date"
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    date: e.target.value,
                  }))
                }
                data-testid="filter-date"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <TextInput
                label="Amount"
                type="number"
                placeholder="Search by amount"
                value={filters.value}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    value: e.target.value,
                  }))
                }
                data-testid="filter-value"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={clearFilters}
                aria-label="Clear all active filters"
                data-testid="clear-filters"
              >
                Clear filters
              </Button>
            )}
          </search>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {filteredTransfers.length === 0
              ? 'No transactions match the current filters'
              : `${filteredTransfers.length} transaction${filteredTransfers.length === 1 ? '' : 's'} found`}
          </p>
          <TransactionsTable transfers={filteredTransfers} />
          {displayTransactionDialog && (
            <TransactionsConfiguration
              open={displayTransactionDialog}
              onClose={handleCloseTransactionDialog}
              onSuccess={handleSuccessTransactionCreation}
            />
          )}
        </div>
      )}
    </div>
  );
}
