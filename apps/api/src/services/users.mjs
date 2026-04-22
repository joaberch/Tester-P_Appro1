import { Test, User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";

export async function getStudents() {
    const users = await User.findAll({
        where: {
            role: "student",
            isDeleted: false,
        },
        attributes: { exclude: ['hashedPassword']}
    });
    return users;
}

export async function getUsers() {
    const users = User.findAll({
        attributes: { exclude: ['hashedPassword'] }
    });
    return users;
}

export async function updateUser(id, body) {
    if (!id || !body) {
        throw new Error(`id and body are required`)
    }

    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(`Utilisateur introuvable.`);
        error.status = 404;
        throw error;
    }

    const payload = {
        login: body.login,
        firstname: body.firstname,
        name: body.name,
        role: body.role,
        isDeleted: body.isDeleted,
    };
    const updatedUser = await user.update(payload);
    const { hashedPassword, ...safeUser } = updatedUser.toJSON();
    return safeUser;
}

export async function archiveUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(`Utilisateur introuvable.`);
        error.status = 404;
        throw error;
    }

    const updatedUser = await user.update({ isDeleted: true });
    const { hashedPassword, ...safeUser } = updatedUser.toJSON();
    return safeUser;
}

export async function createUser(body) {
    const userData = {
        login: body.login,
        firstname: body.firstname,
        name: body.name,
        role: body.role,
        isDeleted: false,
        createdAt: body.createdAt,
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
                attributes: { exclude: ['hashedPassword'] },
                through: { attributes: [] },
                where: { role: 'student', isDeleted: false },
                required: false,
            },
        ],
    });
    return test;
}