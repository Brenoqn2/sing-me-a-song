import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";

const testsRouter = Router();
testsRouter.post("/reset-database", recommendationController.resetDB);
testsRouter.post("/seed-database", recommendationController.seedDB);

export default testsRouter;
