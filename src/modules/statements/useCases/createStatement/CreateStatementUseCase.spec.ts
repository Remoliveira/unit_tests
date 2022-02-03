import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';

import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let stateRepo :InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    stateRepo = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, stateRepo)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  });

  it("should be able to creare a stamentent deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });
    const id = user.id as string;
    const response = await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })

    expect(response).toHaveProperty('amount')
  });

  it("should be able to creare a stamentent withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "123",
      password: "34",
    });
    const id = user.id as string;
    await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })
    const response = await createStatementUseCase.execute({ user_id: id, description: 'withdraw', amount: 100, type: OperationType.WITHDRAW })
    expect(response).toHaveProperty('amount')
  });

  it("should be able to creare a stamentent withdraw for a user that dont exist", async () => {
    expect(async () => {


      const id = 'user.id as string;'
      await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })
      await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 400, type: OperationType.WITHDRAW })

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should no be able to creare a stamentent withdraw with insuficient funds", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "name",
        email: "123",
        password: "34",
      });
      const id = user.id as string;
      await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 300, type: OperationType.DEPOSIT })
      await createStatementUseCase.execute({ user_id: id, description: 'deposit', amount: 400, type: OperationType.WITHDRAW })

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

});
