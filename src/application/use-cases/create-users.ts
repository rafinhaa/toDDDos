import { User } from "@/domain/entities/user";
import { UsersRepository } from "@/application/repositories/users-repository"; 

interface CreateUserUseCaseRequest {
  email: string;
  password: string;
}

export class CreateUserUseCase {

	constructor(private userRepository: UsersRepository) {}

  async execute({ email, password }: CreateUserUseCaseRequest)  {
    const user = User.create({
      email,
      password
    });

    await this.userRepository.create(user);

    return {
			user
		};
  }
}