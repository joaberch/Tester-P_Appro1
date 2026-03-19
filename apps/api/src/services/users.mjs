import { Test, User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";

export async function getStudents() {
    const users = User.findAll({
        where: {
            role: "student",
            isDeleted: false, //TODO return hashedPassword
        }
    });
    return users;
}

export async function getUsers() {
    const users = User.findAll(); //TODO return hashedPassword
    return users;
}

export async function updateUser(id, body) {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(`Utilisateur introuvable.`);
        error.status = 404;
        throw error;
    }

    const payload = { ...body };
    const updatedUser = await user.update(payload); //TODO prevent hashedPassword to be edited?
    return updatedUser;
}

export async function archiveUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(`Utilisateur introuvable.`);
        error.status = 404;
        throw error;
    }

    const updatedUser = await user.update({ isDeleted: true });
    return updatedUser;
}

export async function createUser(body) {
    const userData = {
        ...body,
        isDeleted: false
    }
    if (!body.password) {
        const error = new Error(`Mot de passe requis`);
        error.status = 400;
        throw error;
    }
    userData.hashedPassword = await bcrypt.hash(body.password + process.env.PEPPER, parseInt(process.env.SALT_NBR));

    const createdUser = await User.create(userData);

    const { hashedPassword, ...safeUser } = createdUser.toJSON();
    return safeUser
}

export async function getAssignedUsers(id) {
    const test = await Test.findByPk(id, {
        include: [
            {
                model: User,
                as: "assignedUser",
                through: { attributes: [] },
                where: { role: 'student', isDeleted: false },
                required: false,
            },
        ],
    });
    return test;
}