import express from "express";
import authorizeRoles from "../middlewares/role.mjs";
import { auth } from "../middlewares/auth.mjs";
import { getDocuments } from "../controllers/documents.mjs";

const documentsRouter = express.Router();

documentsRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), getDocuments)

export { documentsRouter };