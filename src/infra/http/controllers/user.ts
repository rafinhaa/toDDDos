import { UsersRepository } from "@/application/repositories/users-repository"
import { CreateUserUseCase } from "@/application/use-cases/create-users"

type UserRegisterController = {
  usersRepository: UsersRepository
  email: string
  password: string
}

export const userRegisterController = async ({
  usersRepository,
  email,
  password,
}: UserRegisterController) => {
  const result = await new CreateUserUseCase(usersRepository).execute({
    email,
    password,
  })

  return result
}
