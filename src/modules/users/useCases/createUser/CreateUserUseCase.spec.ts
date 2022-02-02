import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });
    expect(user).toHaveProperty("name");
  });

  it("should not be able to create a user with the same email", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "1234",
      password: "34",
    });

    const user2 = await expect(
      createUserUseCase.execute({
        name: "name",
        email: "1234",
        password: "34",
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
