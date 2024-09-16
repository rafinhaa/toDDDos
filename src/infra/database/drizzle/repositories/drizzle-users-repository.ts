import { eq } from "drizzle-orm"

import { UsersRepository } from "@/application/repositories/users-repository"
import { User } from "@/domain/entities/user"
import { db } from "@/infra/database/drizzle/config"
import { users } from "@/infra/database/drizzle/config/schema"
import { DrizzleUserMapper } from "@/infra/database/drizzle/mappers/drizzle-users-mapper"

export class DrizzleUsersRepository implements UsersRepository {
  async create(user: User) {
    await db.insert(users).values({
      email: user.email,
      password: user.password,
    })
  }

  async findByEmail({ email }: Pick<User, "email">): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (result.length === 0) return null

    return DrizzleUserMapper.toDomain(result[0])
  }

  async findById({ id }: Pick<User, "id">): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id.toString()))
      .limit(1)

    if (result.length === 0) return null

    return DrizzleUserMapper.toDomain(result[0])
  }
}
