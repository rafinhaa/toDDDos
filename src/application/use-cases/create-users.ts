import { UsersRepository } from "@/application/repositories/users-repository"
import { ConflictError } from "@/application/use-cases/errors/conflict-error"
import { Either, left, right } from "@/core/either"
import { UseCaseError } from "@/core/errors/use-case-error"
import { User } from "@/domain/entities/user"

interface CreateUserUseCaseRequest {
  email: string
  password: string
}

type CreateUserUseCaseResponse = Either<
  UseCaseError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const user = User.create({
      email,
      password,
    })

    const userExists = await this.userRepository.findByEmail({ email })

    if (userExists) return left(new ConflictError("User already exists"))

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
