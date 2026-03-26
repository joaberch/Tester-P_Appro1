import express from "express";
import auth from "../middlewares/auth.mjs";
import { archiveTest, assignTest, createTest, editTest, getAssignedTest, getTest, getTestAttachments, getTestQuestions, getTests, unassignTest } from "../controllers/tests.mjs";

const testsRouter = express.Router();

//Get all tests
testsRouter.get("/", auth, getTests);

//Create a test
testsRouter.post("/", auth, createTest);

//Archive a test
testsRouter.put("/archive/:id", auth, archiveTest);

//Edit a test
testsRouter.put("/:id", auth, editTest);

//Assign a test
testsRouter.post("/:testId/user/:userId", auth, assignTest);

//De-Assign a test
testsRouter.delete("/:testId/user/:userId", auth, unassignTest);

//Get assigned test
testsRouter.get("/assigned", auth, getAssignedTest)

//Get a specific test
testsRouter.get("/:id", auth, getTest);

//Get all questions of a test
testsRouter.get("/:id/questions", auth, getTestQuestions)

//Get attachments of test
testsRouter.get("/:id/attachments", auth, getTestAttachments);

export { testsRouter };