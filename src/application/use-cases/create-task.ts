import { UsersRepository } from "@/application/repositories/users-repository"; 
import { Either, left, right } from "@/core/either";
import { Task, TaskProps } from "@/domain/entities/task";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "./errors/not-found-error";
import { TasksRepository } from "../repositories/tasks-repository";

interface CreateTaskUseCaseRequest extends TaskProps { }

type CreateTaskUseCaseResponse = Either<NotFoundError, {
	task: Task
}>;

export class CreateTaskUseCase {

	constructor(
    private tasksRepository: TasksRepository, 
    private userRepository: UsersRepository) {}

  async execute({ title, userId }: CreateTaskUseCaseRequest) : Promise<CreateTaskUseCaseResponse> {
    
		const user = await this.userRepository.findById({ id: userId });

    if(!user)
      return left(new NotFoundError("User not found"));
    
    const task = Task.create({
      title,
      userId,
    });		

    await this.tasksRepository.create(task);

    return right({
			task
		});
  }
}