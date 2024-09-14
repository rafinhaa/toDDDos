import { User } from "@/domain/entities/user";
import { UsersRepository } from "@/application/repositories/users-repository"; 
import { Either, left, right } from "@/core/either";
import { ConflictError } from "@/application/use-cases/errors/conflict-error";
import { UseCaseError } from "@/core/errors/use-case-error";

interface CreateUserUseCaseRequest {
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<UseCaseError, {
	user: User
}>;

export class CreateUserUseCase {

	constructor(private userRepository: UsersRepository) {}

  async execute({ email, password }: CreateUserUseCaseRequest) : Promise<CreateUserUseCaseResponse> {
    const user = User.create({
      email,
      password
    });

		const userExists = await this.userRepository.findByEmail({ email });

		if (userExists) 
			return left(new ConflictError("User already exists"));
		

    await this.userRepository.create(user);

    return right({
			user
		});
  }
}