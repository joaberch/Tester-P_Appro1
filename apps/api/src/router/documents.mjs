import express from "express";
import auth from "../middlewares/auth.mjs";
import { getDocuments } from "../controllers/documents.mjs";

const documentsRouter = express.Router();

documentsRouter.get("/", auth, getDocuments)

export { documentsRouter };