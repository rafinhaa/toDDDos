import { makeTask } from "@/__tests__/factories/make-task"
import { makeUser } from "@/__tests__/factories/make-user"
import { InMemoryTasksRepository } from "@/__tests__/repositories/in-memory-tasks-repository"
import { InMemoryUsersRepository } from "@/__tests__/repositories/in-memory-user-repository"
import { NotFoundError } from "@/application/use-cases/errors/not-found-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

import { NotPermissionError } from "../errors/not-permission-error"
import { FetchTasksUseCase } from "../fetch-tasks"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTasksRepository: InMemoryTasksRepository

let sut: FetchTasksUseCase

describe("Fetch tasks use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryTasksRepository = new InMemoryTasksRepository()
    sut = new FetchTasksUseCase(
      inMemoryTasksRepository,
      inMemoryUsersRepository,
    )
  })

  it("should be to able to fetch tasks", async () => {
    const newUser = makeUser()
    await inMemoryUsersRepository.create(newUser)
    const tasks = Array.from({ length: 3 }, () =>
      makeTask({ userId: newUser.id }),
    )

    await Promise.all(tasks.map((task) => inMemoryTasksRepository.create(task)))

    const result = await sut.execute({
      userId: newUser.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isLeft()) throw result.value

    expect(result.value.tasks).toHaveLength(3)

    expect(result.value.tasks[0]).toMatchObject({
      title: tasks[0].title,
      userId: tasks[0].userId,
      status: tasks[0].status,
      id: expect.any(UniqueEntityId),
    })

    expect(result.value.tasks[1]).toMatchObject({
      title: tasks[1].title,
      userId: tasks[1].userId,
      status: tasks[1].status,
      id: expect.any(UniqueEntityId),
    })

    expect(result.value.tasks[2]).toMatchObject({
      title: tasks[2].title,
      userId: tasks[2].userId,
      status: tasks[2].status,
      id: expect.any(UniqueEntityId),
    })
  })

  it("should not be able to fetch tasks if user not exists", async () => {
    const result = await sut.execute({
      userId: "any_user_id",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
    expect(result.value).toMatchObject({
      message: "User not found",
    })
  })

  it("should not be able to fetch tasks from another user", async () => {
    const newUser = makeUser()
    await inMemoryUsersRepository.create(newUser)
    const tasks = Array.from({ length: 2 }, () =>
      makeTask({ userId: newUser.id }),
    )

    const anotherUser = makeUser()
    await inMemoryUsersRepository.create(anotherUser)
    const tasksFromAnotherUser = Array.from({ length: 5 }, () =>
      makeTask({ userId: anotherUser.id }),
    )

    const allTasks = [...tasks, ...tasksFromAnotherUser]

    await Promise.all(
      allTasks.map((task) => inMemoryTasksRepository.create(task)),
    )

    const result = await sut.execute({
      userId: newUser.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isLeft()) throw result.value

    expect(result.value.tasks).toHaveLength(2)

    expect(result.value.tasks[0]).toMatchObject({
      title: tasks[0].title,
      userId: tasks[0].userId,
      status: tasks[0].status,
      id: expect.any(UniqueEntityId),
    })

    expect(result.value.tasks[1]).toMatchObject({
      title: tasks[1].title,
      userId: tasks[1].userId,
      status: tasks[1].status,
      id: expect.any(UniqueEntityId),
    })
  })
})
