import express from "express";
import auth from "../middlewares/auth.mjs";
import { createTestResult } from "../controllers/testDone.mjs";

const testDoneRouter = express();

//Create a test result
testDoneRouter.post("/", auth, createTestResult);

export { testDoneRouter };