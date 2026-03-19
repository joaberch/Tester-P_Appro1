import * as usersService from "../services/users.mjs";

export async function getStudents(req, res) {
    const users = await usersService.getStudents();
    res.status(200).json(users);
}

export async function getUsers(req, res) {
    const users = await usersService.getUsers();
    res.status(200).json(users);
}

export async function updateUser(req, res) {
    const users = await usersService.updateUser(req.params.id, req.body);
    res.status(200).json(users);
}

export async function archiveUser(req, res) {
    const users = await usersService.archiveUser(req.params.id);
    res.status(200).json(users);
}

export async function createUser(req, res) {
    const users = await usersService.createUser(req.body);
    res.status(201).json(users);
}

export async function getAssignedUsers(req, res) {
    const users = await usersService.getAssignedUsers(req.params.id);
    res.status(200).json(users);
}