import { User } from "@/domain/entities/user";

export interface UsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: Pick<User, "email">): Promise<User | null>;
}