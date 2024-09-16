import { UsersRepository } from "@/application/repositories/users-repository"; 
import { Either, left, right } from "@/core/either";
import { Task } from "@/domain/entities/task";
import { NotFoundError } from "./errors/not-found-error";
import { TasksRepository } from "../repositories/tasks-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotPermissionError } from "./errors/not-permission-error";

interface FetchTasksUseCaseRequest {
  userId: string
}

type FetchTasksUseCaseResponse = Either<NotFoundError | NotPermissionError, { tasks: Task[] }>;

export class FetchTasksUseCase {

	constructor(
    private tasksRepository: TasksRepository, 
    private userRepository: UsersRepository) {}

  async execute({ userId}: FetchTasksUseCaseRequest) : Promise<FetchTasksUseCaseResponse> {
    
		const user = await this.userRepository.findById({ id: new UniqueEntityId(userId) });

    if(!user)
      return left(new NotFoundError("User not found"));
    
    const tasks = await this.tasksRepository.findManyByUserId(user);

    return right({
      tasks
    });
  }
}