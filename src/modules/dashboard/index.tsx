import { Button } from '@/components/button';
import Spinner from '@/components/spinner/Spinner';
import { useGetBalance } from '@/services/balance';
import { formatCurrency } from '@/utils/general';
import { useMemo } from 'react';

export default function Dashboard() {
  const {
    data: balanceResponse,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetBalance({ enabled: true });
  const formattedBalance = useMemo(() => {
    if (!balanceResponse) return '';
    return formatCurrency(
      balanceResponse.accountBalance,
      balanceResponse.currency,
    );
  }, [balanceResponse]);
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          data-testid="loading-balance"
          className="flex flex-col items-center gap-2"
        >
          <p>Loading your current balance</p>
          <p className="text-sm text-gray-500">
            Please wait while we load your current balance
          </p>
          <Spinner />
        </div>
      )}
      {isError && (
        <div
          role="alert"
          aria-atomic="true"
          data-testid="error-balance"
          className="flex flex-col items-center gap-2"
        >
          <p className="text-red-500">
            There was an error fetching the balance
          </p>
          <Button
            variant="secondary"
            aria-label="Retry loading balance"
            data-testid="retry-button"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      )}
      {isSuccess && balanceResponse && (
        <div
          className="flex flex-col items-center gap-2 h-screen"
          data-testid="balance-section"
        >
          <h1 className="text-2xl font-bold pt-4 mt-4">Dashboard</h1>
          <section
            aria-label="Account balance"
            className="flex flex-col items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/8 -translate-y-1/2 bg-white p-4 rounded-xl shadow-md"
          >
            <p>Here is your current balance</p>
            <p className="text-sm text-gray-500">
              Your current balance is {formattedBalance}
            </p>
            <p className="text-sm text-gray-500">
              Your configured currency is {balanceResponse.currency}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
