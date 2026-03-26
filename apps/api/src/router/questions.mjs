import express from "express";
import auth from "../middlewares/auth.mjs";
import { archiveQuestion, getQuestionAnswers, createQuestion, editQuestion } from "../controllers/questions.mjs";

const questionsRouter = express();

//Get all answers of a question
questionsRouter.get("/:id/answers", auth, getQuestionAnswers)

//Create a question
questionsRouter.post("/", auth, createQuestion);

//Archive a question
questionsRouter.put("/archive/:id", auth, archiveQuestion);

//Edit a question
questionsRouter.put("/:id", auth, editQuestion);

export { questionsRouter };