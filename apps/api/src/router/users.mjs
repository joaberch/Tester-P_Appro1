import express from "express";
import auth from "../middlewares/auth.mjs";
import { createUser, getAssignedUsers, getStudents, getUsers, updateUser, archiveUser, getUser } from "../controllers/users.mjs";

const usersRouter = express();

//Get all students
usersRouter.get("/students", auth, getStudents);

//Get all users
usersRouter.get("/", auth, getUsers);

//Update user
usersRouter.put("/:id", auth, updateUser);

//Archive an user
usersRouter.put("/archive/:id", auth, archiveUser); //TODO - who can do in documentation

//Create user
usersRouter.post("/", auth, createUser); //TODO - who can do in documentation

//Get students assigned to a test
usersRouter.get("/assignedTo/:id", auth, getAssignedUsers);

//Get user
usersRouter.get("/me", auth, getUser);

export { usersRouter };