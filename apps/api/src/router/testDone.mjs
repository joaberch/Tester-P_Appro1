import express from "express";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { createTestResult } from "../controllers/testDone.mjs";

const testDoneRouter = express();

//Create a test result
testDoneRouter.post("/", auth, authorizeRoles("admin", "teacher", "student"), createTestResult);

export { testDoneRouter };