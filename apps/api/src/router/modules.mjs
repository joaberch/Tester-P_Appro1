import express from "express";
import auth from "../middlewares/auth.mjs";
import { archiveModule, createModule, editModule, getModule, getModules } from "../controllers/modules.mjs";

const modulesRouter = express.Router();

//Get all modules
modulesRouter.get("/", auth, getModules)

//Get a specific module
modulesRouter.get("/:id", auth, getModule);

//Create a module
modulesRouter.post("/", auth, createModule);

//Archive a module
modulesRouter.put("/archive/:id", auth, archiveModule);

//Edit a module
modulesRouter.put("/:id", auth, editModule);

export { modulesRouter };