import { FakerHashGenerate } from "@/__tests__/encryption/faker-hash-generate"
import { makeUser } from "@/__tests__/factories/make-user"
import { InMemoryUsersRepository } from "@/__tests__/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "@/application/use-cases/create-users"
import { ConflictError } from "@/application/use-cases/errors/conflict-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let inMemoryUsersRepository: InMemoryUsersRepository
let fakerHashGenerate: FakerHashGenerate
let sut: CreateUserUseCase

describe("Create user use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakerHashGenerate = new FakerHashGenerate()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakerHashGenerate)
  })

  it("should be to able to create a new user", async () => {
    const newUser = makeUser()

    const result = await sut.execute(newUser)

    if (result.isLeft()) throw result.value

    expect(result.value.user).toMatchObject({
      email: newUser.email,
      password: expect.any(String),
      id: expect.any(UniqueEntityId),
    })
  })

  it("should not be able to create a new user with same email", async () => {
    const newUser = makeUser()
    await sut.execute(newUser)

    const userWithSameEmail = makeUser({
      email: newUser.email,
    })

    const result = await sut.execute(userWithSameEmail)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
    expect(result.value).toMatchObject({
      message: "User already exists",
    })
  })
})
