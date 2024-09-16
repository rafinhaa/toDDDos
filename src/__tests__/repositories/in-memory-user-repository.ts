import { UsersRepository } from "@/application/repositories/users-repository"
import { User } from "@/domain/entities/user"

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
  }

  async findByEmail({ email }: Pick<User, "email">): Promise<User | null> {
    return this.items.find((item) => item.email === email) || null
  }

  async findById({ id }: Pick<User, "id">): Promise<User | null> {
    return (
      this.items.find((item) => item.id.toString() === id.toString()) || null
    )
  }
}
