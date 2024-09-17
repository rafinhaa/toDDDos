import { HashGenerator } from "@/application/encryption/hash-generator"
import { UsersRepository } from "@/application/repositories/users-repository"
import { CreateUserUseCase } from "@/application/use-cases/create-users"

type UserRegisterController = {
  usersRepository: UsersRepository
  hashGenerator: HashGenerator
  email: string
  password: string
}

export const userRegisterController = async ({
  usersRepository,
  hashGenerator,
  email,
  password,
}: UserRegisterController) => {
  const result = await new CreateUserUseCase(
    usersRepository,
    hashGenerator,
  ).execute({
    email,
    password,
  })

  return result
}
