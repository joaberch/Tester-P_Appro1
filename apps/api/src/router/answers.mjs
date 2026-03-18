import express from "express";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { auth } from "../auth/authMiddleware.mjs";
import { archiveAnswer, createAnswer, editAnswer } from "../controllers/answers.mjs";

const answersRouter = express.Router();

//Create an answer
answersRouter.post("/", auth, authorizeRoles("admin", "teacher"), createAnswer);

//Archive an answer
answersRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveAnswer);

//Edit an answer
answersRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editAnswer);

export { answersRouter };