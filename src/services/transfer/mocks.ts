import type { TransferItem, TransferListResponse } from './types';
import { faker } from '@faker-js/faker';

export function TransferItemMock(data?: Partial<TransferItem>): TransferItem {
  return {
    value: faker.number.int(),
    date: faker.date.recent().toISOString().split('T')[0],
    currency: faker.finance.currencyCode(),
    payeer: {
      document: faker.finance.accountNumber(),
      name: faker.person.fullName(),
    },
    ...data,
  };
}

export function TransferListMock(
  data?: Partial<TransferListResponse>,
): TransferListResponse {
  return {
    message: faker.lorem.sentence(),
    transfers: Array.from({ length: faker.number.int(10) }, () =>
      TransferItemMock(),
    ),
    ...data,
  };
}
