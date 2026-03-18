import express from "express";
import { success } from "../helper.mjs";
import { User, Test } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import bcrypt from "bcrypt";
import { createUser, getAssignedUsers, getStudents, getUsers, updateUser } from "../controllers/users.mjs";
import { archiveUser } from "../services/users.mjs";

const usersRouter = express();

//Get all students
usersRouter.get("/students", auth, authorizeRoles("admin", "teacher"), getStudents);

//Get all users
usersRouter.get("/", auth, authorizeRoles("admin"), getUsers);

//Update user
usersRouter.put("/:id", auth, authorizeRoles("admin"), updateUser);

//Archive an user
usersRouter.put("/archive/:id", auth, authorizeRoles("admin"), archiveUser); //TODO - who can do in documentation

//Create user
usersRouter.post("/", auth, authorizeRoles("admin"), createUser); //TODO - who can do in documentation

//Get students assigned to a test
usersRouter.get("/assignedTo/:id", auth, authorizeRoles("teacher", "admin"), getAssignedUsers)

export { usersRouter };