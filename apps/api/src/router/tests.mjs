import express from "express";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { archiveTest, assignTest, createTest, editTest, getAssignedTest, getTest, getTestAttachments, getTestQuestions, getTests, unassignTest } from "../controllers/tests.mjs";

const testsRouter = express.Router();

//Get all tests
testsRouter.get("/", auth, authorizeRoles("admin", "teacher"), getTests);

//Create a test
testsRouter.post("/", auth, authorizeRoles("admin", "teacher"), createTest);

//Archive a test
testsRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveTest);

//Edit a test
testsRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editTest);

//Assign a test
testsRouter.post("/:testId/user/:userId", auth, authorizeRoles("admin", "teacher"), assignTest);

//De-Assign a test
testsRouter.delete("/:testId/user/:userId", auth, authorizeRoles("admin", "teacher"), unassignTest);

//Get assigned test
testsRouter.get("/assigned", auth, authorizeRoles("admin", "teacher", "student"), getAssignedTest)

//Get a specific test
testsRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), getTest);

//Get all questions of a test
testsRouter.get("/:id/questions", auth, authorizeRoles("admin", "teacher", "student"), getTestQuestions)

//Get all attachments
testsRouter.get("/:id/attachments", auth, authorizeRoles("admin", "teacher", "student"), getTestAttachments);

export { testsRouter };