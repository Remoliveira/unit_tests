import { Router } from "express";

import { CreateStatementController } from "../modules/statements/useCases/createStatement/CreateStatementController";
import { CreateTranserController } from "../modules/statements/useCases/createStatement/CreateTransferController";
import { GetBalanceController } from "../modules/statements/useCases/getBalance/GetBalanceController";
import { GetStatementOperationController } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const createTranserController = new CreateTranserController();

statementRouter.use(ensureAuthenticated);

statementRouter.get("/balance", getBalanceController.execute);
statementRouter.post("/deposit", createStatementController.execute);
statementRouter.post("/withdraw", createStatementController.execute);
statementRouter.get("/:statement_id", getStatementOperationController.execute);
statementRouter.post("/transfer/:user_id", createStatementController.execute);

export { statementRouter };
