import { UsersRepository } from "@/application/repositories/users-repository"
import { Either, left, right } from "@/core/either"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Task, TaskProps } from "@/domain/entities/task"

import { TasksRepository } from "../repositories/tasks-repository"
import { NotFoundError } from "./errors/not-found-error"

interface CreateTaskUseCaseRequest {
  title: string
  userId: string
}

type CreateTaskUseCaseResponse = Either<
  NotFoundError,
  {
    task: Task
  }
>

export class CreateTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    title,
    userId,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const entityUserId = new UniqueEntityId(userId)

    const user = await this.userRepository.findById({
      id: entityUserId,
    })

    if (!user) return left(new NotFoundError("User not found"))

    const task = Task.create({
      title,
      userId: entityUserId,
    })

    await this.tasksRepository.create(task)

    return right({
      task,
    })
  }
}
