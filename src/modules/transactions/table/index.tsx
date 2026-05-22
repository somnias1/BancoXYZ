import type { TransactionsTableProps } from './types';
import TransactionsRow from '../row';

export default function TransactionsTable({
  transfers,
}: Readonly<TransactionsTableProps>) {
  return (
    <section aria-label="Transactions table" className="w-full overflow-x-auto">
      <table
        data-testid="transactions-table"
        className="w-full border-collapse border-2 border-gray-400 bg-brand-400"
      >
        <caption className="sr-only">
          List of transactions including date, payeer, amount, and currency
        </caption>
        <thead className="bg-brand-400">
          <tr className="text-left text-white border-b-2 border-gray-400">
            <th
              scope="col"
              className="px-4 py-2 font-bold border-r-2 border-gray-400"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-bold border-r-2 border-gray-400"
            >
              Payeer
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-bold border-r-2 border-gray-400"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-bold border-r-2 border-gray-400"
            >
              Currency
            </th>
          </tr>
        </thead>
        <tbody className="bg-brand-50">
          {transfers.length > 0 &&
            transfers.map((transfer) => (
              <TransactionsRow
                key={`${transfer.date}-${transfer.payeer.document}`}
                transfer={transfer}
              />
            ))}
          {transfers.length === 0 && (
            <tr data-testid="empty-transactions">
              <td colSpan={4} className="px-4 py-2 text-center">
                No transfers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
