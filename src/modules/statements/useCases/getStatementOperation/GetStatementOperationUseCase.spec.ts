import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from '../getBalance/GetBalanceError';
import { GetStatementOperationError } from './GetStatementOperationError';



let inMemoryUsersRepository: InMemoryUsersRepository;
let stateRepo :InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    stateRepo = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, stateRepo)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, stateRepo);

  });

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });
    const id = user.id as string;
    const statement = await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })
    const statementId = statement.id as string;
    const response = await getStatementOperationUseCase.execute({ user_id: id, statement_id: statementId })

    expect(response.type).toEqual('deposit')
  });

  it("should be able to get statement op for a user that dont exist", async () => {
    expect(async () => {

      const id = 'user.id as string;'
      const statement = await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })
      const statementId = statement.id as string;
      await getStatementOperationUseCase.execute({ user_id: id, statement_id: statementId })

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it("should be able to get statement op for a user that dont exist", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "name",
        email: "123",
        password: "34",
      });
      const id = user.id as string;
      await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })
      const statementId = 'statement.id as string;'
      await getStatementOperationUseCase.execute({ user_id: id, statement_id: statementId })

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
});
