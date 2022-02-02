import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate a user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a new user", async () => {
    await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });

    const response = await authenticateUserUseCase.execute({
      email: "123",
      password: "34",
    });
    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate a user that does not exists", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "12344",
        password: "344",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    await createUserUseCase.execute({
      name: "names",
      email: "123s",
      password: "34",
    });
    await expect(
      authenticateUserUseCase.execute({
        email: "123s",
        password: "344",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
