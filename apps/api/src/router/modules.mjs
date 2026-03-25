import express from "express";
import { auth } from "../middlewares/auth.mjs";
import authorizeRoles from "../middlewares/role.mjs";
import { archiveModule, createModule, editModule, getModule, getModules } from "../controllers/modules.mjs";

const modulesRouter = express.Router();

//Get all modules
modulesRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), getModules)

//Get a specific module
modulesRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), getModule);

//Create a module
modulesRouter.post("/", auth, authorizeRoles("admin", "teacher"), createModule);

//Archive a module
modulesRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveModule);

//Edit a module
modulesRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editModule);

export { modulesRouter };