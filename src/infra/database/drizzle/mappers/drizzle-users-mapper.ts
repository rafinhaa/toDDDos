import { InferSelectModel } from "drizzle-orm"

import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { User } from "@/domain/entities/user"
import { users } from "@/infra/database/drizzle/config/schema"

type UsersColumns = InferSelectModel<typeof users>

export class DrizzleUserMapper {
  static toDomain(raw: UsersColumns): User {
    return User.create(
      {
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toDrizzle(user: User) {
    return {
      id: user.id.toString(),
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    }
  }
}
