import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

type FreshTransfer = {
  value: number;
  currency: string;
  payeerDocument: string;
  transferDate: string;
};

export const test = base.extend<{ freshTransfer: FreshTransfer }>({
  freshTransfer: async (_, use) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const transferDate = tomorrow.toISOString().split('T')[0];

    await use({
      value: faker.number.int({ min: 1, max: 9999 }),
      currency: faker.finance.currencyCode(),
      payeerDocument: faker.finance.accountNumber(),
      transferDate,
    });
  },
});

export { expect };
