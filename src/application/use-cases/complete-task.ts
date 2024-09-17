import { UsersRepository } from "@/application/repositories/users-repository"
import { Either, left, right } from "@/core/either"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Task, TaskProps } from "@/domain/entities/task"
import { TaskStatus } from "@/domain/value-objects/task-status"

import { TasksRepository } from "../repositories/tasks-repository"
import { NotFoundError } from "./errors/not-found-error"
import { NotPermissionError } from "./errors/not-permission-error"

interface CompleteTaskUseCaseRequest {
  taskId: string
  userId: string
}

type CompleteTaskUseCaseResponse = Either<
  NotFoundError | NotPermissionError,
  { task: Task }
>

export class CompleteTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    taskId,
    userId,
  }: CompleteTaskUseCaseRequest): Promise<CompleteTaskUseCaseResponse> {
    const user = await this.userRepository.findById({
      id: new UniqueEntityId(userId),
    })

    if (!user) return left(new NotFoundError("User not found"))

    const task = await this.tasksRepository.findById({
      id: new UniqueEntityId(taskId),
    })

    if (!task) return left(new NotFoundError("Task not found"))

    if (task.userId.toString() !== userId)
      return left(new NotPermissionError("User does not own this task"))

    task.status = TaskStatus.DONE
    task.completedAt = new Date()

    await this.tasksRepository.completeTask(task)

    return right({
      task,
    })
  }
}
