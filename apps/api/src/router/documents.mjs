import express from "express";
import auth from "../middlewares/auth.mjs";
import { getDocuments } from "../controllers/documents.mjs";

const documentsRouter = express.Router();

//Get all documents
documentsRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), getDocuments)

export { documentsRouter };