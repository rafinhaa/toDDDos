import { makeTask } from "@/__tests__/factories/make-task"
import { makeUser } from "@/__tests__/factories/make-user"
import { InMemoryTasksRepository } from "@/__tests__/repositories/in-memory-tasks-repository"
import { InMemoryUsersRepository } from "@/__tests__/repositories/in-memory-user-repository"
import { NotFoundError } from "@/application/use-cases/errors/not-found-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

import { CreateTaskUseCase } from "../create-task"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTasksRepository: InMemoryTasksRepository

let sut: CreateTaskUseCase

describe("Create task use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTasksRepository = new InMemoryTasksRepository()
    sut = new CreateTaskUseCase(
      inMemoryTasksRepository,
      inMemoryUsersRepository,
    )
  })

  it("should be to able to create a new task", async () => {
    const newUser = makeUser()
    await inMemoryUsersRepository.create(newUser)

    const newTask = makeTask({ userId: newUser.id })

    const result = await sut.execute(newTask)

    if (result.isLeft()) throw result.value

    expect(result.value.task).toMatchObject({
      title: newTask.title,
      userId: newTask.userId,
      status: newTask.status,
      id: expect.any(UniqueEntityId),
    })
  })

  it("should not be able to create a new task if user not exists", async () => {
    const newTask = makeTask()

    const result = await sut.execute(newTask)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
    expect(result.value).toMatchObject({
      message: "User not found",
    })
  })
})
