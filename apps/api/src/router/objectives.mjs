import express from "express";
import auth from "../middlewares/auth.mjs";
import authorizeRoles from "../middlewares/role.mjs";
import { ObjectiveController as Objective } from "../controllers/objectives.mjs";
const objectivesRouter = express();

//Get all objectives of module
objectivesRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), Objective.get);

//Create an objective
objectivesRouter.post("/", auth, authorizeRoles("admin", "teacher"), Objective.create);

//Archive an objective
objectivesRouter.put("/archive/:id", auth, authorizeRoles("admin", "teacher"), Objective.archive);

//Edit an objective
objectivesRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), Objective.edit);

export { objectivesRouter };