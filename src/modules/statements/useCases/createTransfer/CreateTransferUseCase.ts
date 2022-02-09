import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { OperationType } from "../../entities/Statement";
interface IRequest {
  user_id: string;
  destinyUser: string;
  amount: number;
  description: string;
}
@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, destinyUser, amount, description }: IRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const userDestinated = await this.usersRepository.findById(destinyUser);

    if (!userDestinated) {
      throw new CreateStatementError.UserNotFound();
    }

    const balance = await this.statementsRepository.getUserBalance({ user_id });

    if (balance.balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const sendTransferUser = await this.statementsRepository.create({
      user_id,
      type: "transfer" as OperationType,
      amount,
      description,
    });

    const receivedTransferUser = await this.statementsRepository.create({
      user_id: destinyUser,
      type: "deposit" as OperationType,
      amount,
      description,
    });

    return { sendTransferUser, receivedTransferUser };
  }
}
