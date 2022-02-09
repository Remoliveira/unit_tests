import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTranserController {
  async execute(request: Request, response: Response): Promise<Response> {
    const destinyUser = request.params.user_id;
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const createTranser = container.resolve(CreateTransferUseCase);

    const { sendTransferUser, receivedTransferUser } =
      await createTranser.execute({
        user_id,
        destinyUser,
        amount,
        description,
      });

    return response.status(201).json({
      sendTransferUser,
      receivedTransferUser,
    });
  }
}
