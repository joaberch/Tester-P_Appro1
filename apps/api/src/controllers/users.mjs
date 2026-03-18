import * as usersService from "../services/users.mjs";
import { ValidationError } from "sequelize";

export async function getStudents(req, res) {
    try {
        const users = await usersService.getStudents();
        res.status(200).json(users);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getUsers(req, res) {
    try {
        const users = await usersService.getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function updateUser(req, res) {
    try {
        const users = await usersService.updateUser(req.params.id, req.body);
        res.status(200).json(users);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveUser(req, res) {
    try {
        const users = await usersService.archiveUser(req.params.id);
        res.status(200).json(users);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function createUser(req, res) {
    try {
        const users = await usersService.createUser(req.body);
        res.status(201).json(users);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json(err);
        }
        if (err.name == "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Le login doit être unique." })
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getAssignedUsers(req, res) {
    try {
        const users = await usersService.getAssignedUsers(req.params.id);
        res.status(200).json(users);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}