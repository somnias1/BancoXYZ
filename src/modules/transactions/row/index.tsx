import { memo } from 'react';
import type { TransactionsRowProps } from './types';
import { formatCurrency, formatDate } from '@/utils/general';

export default memo(function TransactionsRow({
  transfer,
}: Readonly<TransactionsRowProps>) {
  const formattedDate = formatDate(transfer.date);
  const formattedAmount = formatCurrency(transfer.value, transfer.currency);

  return (
    <tr
      className="border-b border-gray-300 hover:bg-brand-100"
      aria-label={`Transaction on ${formattedDate} by ${transfer.payeer.name} for ${formattedAmount}`}
    >
      <td className="px-4 py-2 border-r-2 border-gray-400">
        <time dateTime={transfer.date}>{formattedDate}</time>
      </td>
      <td className="px-4 py-2 border-r-2 border-gray-400">
        {transfer.payeer.name}
      </td>
      <td className="px-4 py-2 border-r-2 border-gray-400">
        {formattedAmount}
      </td>
      <td className="px-4 py-2 border-r-2 border-gray-400">
        {transfer.currency}
      </td>
    </tr>
  );
});
