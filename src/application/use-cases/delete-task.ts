import { UsersRepository } from "@/application/repositories/users-repository"; 
import { Either, left, right } from "@/core/either";
import { Task, TaskProps } from "@/domain/entities/task";
import { NotFoundError } from "./errors/not-found-error";
import { TasksRepository } from "../repositories/tasks-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotPermissionError } from "./errors/not-permission-error";

interface DeleteTaskUseCaseRequest {
  taskId: string
  userId: string
}

type DeleteTaskUseCaseResponse = Either<NotFoundError, null>;

export class DeleteTaskUseCase {

	constructor(
    private tasksRepository: TasksRepository, 
    private userRepository: UsersRepository) {}

  async execute({ taskId, userId}: DeleteTaskUseCaseRequest) : Promise<DeleteTaskUseCaseResponse> {
    
		const user = await this.userRepository.findById({ id: new UniqueEntityId(userId) });

    if(!user)
      return left(new NotFoundError("User not found"));
    
    const task = await this.tasksRepository.findById({ id: new UniqueEntityId(taskId) });		

    if(!task)
      return left(new NotFoundError("Task not found"));
    
    if (task.userId.toString() !== userId) 
      return left(new NotPermissionError("User does not own this task"));

    await this.tasksRepository.deleteTask(task);

    return right(null);
  }
}