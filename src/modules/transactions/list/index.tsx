import Button from '@/components/button/Button';
import Spinner from '@/components/spinner/Spinner';
import TextInput from '@/components/textInput/TextInput';
import { useGetTransferList } from '@/services/transfer';
import TransactionsTable from '../table';
import { useMemo, useState } from 'react';

export default function TransactionsList() {
  const {
    data: transferListResponse,
    isLoading,
    isError,
    refetch,
    isSuccess,
  } = useGetTransferList();

  const initialFilters = { payeer: '', date: '', value: '' };
  const [filters, setFilters] = useState(initialFilters);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const clearFilters = () => setFilters(initialFilters);

  const filteredTransfers = useMemo(() => {
    return (
      transferListResponse?.transfers.filter((transfer) => {
        const matchesPayeer =
          !filters.payeer ||
          transfer.payeer.name
            .toLowerCase()
            .includes(filters.payeer.toLowerCase().trim());
        const matchesDate =
          !filters.date || transfer.date.slice(0, 10) === filters.date.slice(0, 10);
        const matchesValue =
          !filters.value ||
          transfer.value.toString().includes(filters.value.trim());

        return matchesPayeer && matchesDate && matchesValue;
      }) ?? []
    );
  }, [transferListResponse, filters]);

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
      {isSuccess && transferListResponse && (
        <div className="flex flex-col gap-4 items-center h-screen w-full p-4 m-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <search
            aria-label="Filter transactions"
            className="flex flex-wrap gap-3 w-full items-end"
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
        </div>
      )}
    </div>
  );
}
