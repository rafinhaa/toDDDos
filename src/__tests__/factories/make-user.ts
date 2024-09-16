import { faker } from "@faker-js/faker"

import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { User } from "@/domain/entities/user"

export const makeUser = (override?: Partial<User>): User => {
  return User.create({
    id: new UniqueEntityId(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  })
}
