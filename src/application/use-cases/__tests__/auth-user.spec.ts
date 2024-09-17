import { FakerHashComparer } from "@/__tests__/encryption/faker-hash-comparer"
import { makeUser } from "@/__tests__/factories/make-user"
import { InMemoryUsersRepository } from "@/__tests__/repositories/in-memory-user-repository"
import { AuthUserUseCase } from "@/application/use-cases/auth-user"
import { WrongCredentialsError } from "@/application/use-cases/errors/wrong-credentials-error"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let inMemoryUsersRepository: InMemoryUsersRepository
let fakerHashComparer: FakerHashComparer
let sut: AuthUserUseCase

describe("Auth user use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakerHashComparer = new FakerHashComparer()
    sut = new AuthUserUseCase(inMemoryUsersRepository, fakerHashComparer)
  })

  it("should be to able to authenticate a user", async () => {
    const newUser = makeUser()
    await inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      email: newUser.email,
      password: newUser.password,
    })

    if (result.isLeft()) throw result.value

    expect(result.value.user).toMatchObject({
      email: newUser.email,
      password: expect.any(String),
      id: expect.any(UniqueEntityId),
    })
  })

  it("should not be able to authenticate with wrong credentials", async () => {
    const newUser = makeUser()
    inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      email: newUser.email,
      password: "wrong-password",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
    expect(result.value).toMatchObject({
      message: "Wrong credentials",
    })
  })
})
