import { CreateUserUseCase } from "@/application/use-cases/create-users";
import { InMemoryUsersRepository } from "@/__tests__/repositories/in-memory-user-repository";
import { makeUser } from "@/__tests__/factories/make-user";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ConflictError } from "@/application/use-cases/errors/conflict-error";


let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe("Create user use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be to able to create a new user", async () => {
    const newUser = makeUser();

    const result = await sut.execute(newUser);

    if (result.isLeft()) throw result.value;

    expect(result.value.user).toMatchObject({
      email: newUser.email,
      password: newUser.password,
      id: expect.any(UniqueEntityId)
    });
  });

  it("should not be able to create a new user with same email", async () => {
    const newUser = makeUser();
    await sut.execute(newUser);

    const userWithSameEmail = makeUser({
      email: newUser.email
    });

    const result = await sut.execute(userWithSameEmail); 
    
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictError);
    expect(result.value).toMatchObject({
      message: "User already exists",
    });
  });
});