import { HashGenerator } from "@/application/encryption/hash-generator"
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
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userExists = await this.userRepository.findByEmail({ email })

    if (userExists) return left(new ConflictError("User already exists"))

    const passwordHash = await this.hashGenerator.generate(password)

    const user = User.create({
      email,
      password: passwordHash,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
