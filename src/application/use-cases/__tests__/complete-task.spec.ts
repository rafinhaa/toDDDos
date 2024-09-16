import { makeTask } from "@/__tests__/factories/make-task"
import { makeUser } from "@/__tests__/factories/make-user"
import { InMemoryTasksRepository } from "@/__tests__/repositories/in-memory-tasks-repository"
import { InMemoryUsersRepository } from "@/__tests__/repositories/in-memory-user-repository"
import { NotFoundError } from "@/application/use-cases/errors/not-found-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

import { CompleteTaskUseCase } from "../complete-task"
import { NotPermissionError } from "../errors/not-permission-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTasksRepository: InMemoryTasksRepository

let sut: CompleteTaskUseCase

describe("Complete task use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTasksRepository = new InMemoryTasksRepository()
    sut = new CompleteTaskUseCase(
      inMemoryTasksRepository,
      inMemoryUsersRepository,
    )
  })

  it("should be to able to complete a task", async () => {
    const newUser = makeUser()
    await inMemoryUsersRepository.create(newUser)
    const task = makeTask({ userId: newUser.id })
    await inMemoryTasksRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: newUser.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isLeft()) throw result.value

    expect(result.value.task).toMatchObject({
      title: task.title,
      userId: task.userId,
      status: 1,
      id: expect.any(UniqueEntityId),
    })
  })

  it("should not be able to complete a task if user not exists", async () => {
    const result = await sut.execute({
      taskId: "any_id",
      userId: "any_user_id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
    expect(result.value).toMatchObject({
      message: "User not found",
    })
  })

  it("should not be able to complete a task if task not exists", async () => {
    const newUser = makeUser()
    await inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      taskId: "any_id",
      userId: newUser.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
    expect(result.value).toMatchObject({
      message: "Task not found",
    })
  })

  it("should not be able to complete a task if user does not own this task", async () => {
    const owner = makeUser()
    await inMemoryUsersRepository.create(owner)

    const anotherUser = makeUser()
    await inMemoryUsersRepository.create(anotherUser)

    const task = makeTask()
    await inMemoryTasksRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: anotherUser.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotPermissionError)
    expect(result.value).toMatchObject({
      message: "User does not own this task",
    })
  })
})
