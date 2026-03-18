import express from "express";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { archiveQuestion, getQuestionAnswers } from "../controllers/questions.mjs";
import { createQuestion, editQuestion } from "../services/questions.mjs";

const questionsRouter = express();

//Get all answers of a question
questionsRouter.get("/:id/answers", auth, authorizeRoles("admin", "teacher", "student"), getQuestionAnswers)

//Create a question
questionsRouter.post("/", auth, authorizeRoles("admin", "teacher"), createQuestion);

//Archive a question
questionsRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveQuestion);

//Edit a question
questionsRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editQuestion);

export { questionsRouter };