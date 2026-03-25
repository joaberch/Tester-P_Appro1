import express from "express";
import { auth } from "../middlewares/auth.mjs";
import authorizeRoles from "../middlewares/role.mjs";
import { archiveObjective, createObjective, editObjective, getObjectivesOfModule } from "../controllers/objectives.mjs";

const objectivesRouter = express();

//Get all objectives of module
objectivesRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), getObjectivesOfModule);

//Create an objective
objectivesRouter.post("/", auth, authorizeRoles("admin", "teacher"), createObjective);

//Archive an objective
objectivesRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), archiveObjective);

//Edit an objective
objectivesRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), editObjective);

export { objectivesRouter };