import { faker } from "@faker-js/faker"
import type { LoginResponse } from "./types"

export function LoginMock(data: Partial<LoginResponse>): LoginResponse {
    return {
        token: faker.string.uuid(),
        user: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
        },
        ...data,
    };
}