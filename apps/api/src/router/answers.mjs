import express from "express";
import auth from "../middlewares/auth.mjs";
import { archiveAnswer, createAnswer, editAnswer } from "../controllers/answers.mjs";

const answersRouter = express.Router();

//Create an answer
answersRouter.post("/", auth, createAnswer);

//Archive an answer
answersRouter.put("/archive/:id", auth, archiveAnswer);

//Edit an answer
answersRouter.put("/:id", auth, editAnswer);

export { answersRouter };