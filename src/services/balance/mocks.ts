import { faker } from "@faker-js/faker";
import type { BalanceResponse } from "./types";

export function BalanceMock(data?: Partial<BalanceResponse>): BalanceResponse {
    return {
        currency: faker.finance.currencyCode(),
        accountBalance: faker.number.int(),
        ...data,
    }
}