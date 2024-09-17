import { HashComparer } from "@/application/encryption/hash-comparer"
import { UsersRepository } from "@/application/repositories/users-repository"
import { WrongCredentialsError } from "@/application/use-cases/errors/wrong-credentials-error"
import { Either, left, right } from "@/core/either"
import { User } from "@/domain/entities/user"

interface AuthUserUseCaseRequest {
  email: string
  password: string
}

type AuthUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    user: User
  }
>

export class AuthUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    email,
    password,
  }: AuthUserUseCaseRequest): Promise<AuthUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail({ email })

    if (!user) return left(new WrongCredentialsError())

    const passwordHash = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!passwordHash) return left(new WrongCredentialsError())

    return right({
      user,
    })
  }
}
