import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from './GetBalanceError';


let inMemoryUsersRepository: InMemoryUsersRepository;
let stateRepo :InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    stateRepo = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, stateRepo)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(stateRepo, inMemoryUsersRepository)

  });

  it("should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });
    const id = user.id as string;
    await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })

    const response = await getBalanceUseCase.execute({ user_id: id })

    expect(response.balance).toEqual(300)
  });

  it("should be able to get balance for a user that dont exist", async () => {
    expect(async () => {

      const id = 'user.id as string;'
      await getBalanceUseCase.execute({ user_id: id })

    }).rejects.toBeInstanceOf(GetBalanceError)
  });
});
