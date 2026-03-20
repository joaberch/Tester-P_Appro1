import express from "express";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { auth } from "../auth/authMiddleware.mjs";
import { getDocuments } from "../controllers/documents.mjs";

const documentsRouter = express.Router();

documentsRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), getDocuments)

export { documentsRouter };