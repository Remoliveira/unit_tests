import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUser: ShowUserProfileUseCase;

describe("Show user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUser = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });

    const response = await showUser.execute(user.id as string);

    expect(response).toBe(user);
  });

  it("should not be able to show a unexistent", async () => {
    expect(showUser.execute("13124")).rejects.toEqual(
      new ShowUserProfileError()
    );
  });
});
