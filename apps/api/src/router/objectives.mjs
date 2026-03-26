import express from "express";
import auth from "../middlewares/auth.mjs";
import { archiveObjective, createObjective, editObjective, getObjectivesOfModule } from "../controllers/objectives.mjs";

const objectivesRouter = express();

//Get all objectives of module
objectivesRouter.get("/", auth, getObjectivesOfModule);

//Create an objective
objectivesRouter.post("/", auth, createObjective);

//Archive an objective
objectivesRouter.put("/archive/:id", auth, archiveObjective);

//Edit an objective
objectivesRouter.put("/:id", auth, editObjective);

export { objectivesRouter };