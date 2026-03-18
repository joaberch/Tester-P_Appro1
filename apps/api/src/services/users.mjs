import { Test, User } from "../db/sequelize.mjs";

export async function getStudents() {
    const users = User.findAll({
        where: {
            role: "student",
            isDeleted: false, //TODO check return hashedPassword
        }
    });
    return users;
}

export async function getUsers() {
    const users = User.findAll(); //TODO check return hashedPassword
    return users;
}

export async function updateUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(`Utilisateur introuvable.`);
        error.status = 404;
        throw error;
    }

    const updatedUser = await user.update(req.body); //TODO prevent hashedPassword to be edited?
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

export async function createUser() {
    const userData = {
        ...req.body,
        isDeleted: false
    }
    if (!req.body.password) {
        return res.status(400).json({ message: "Mot de passe requis." });
    }
    userData.hashedPassword = await bcrypt.hash(req.body.password + process.env.PEPPER, parseInt(process.env.SALT_NBR));

    const createdUser = await User.create(userData);

    const { hashedPassword, ...safeUser } = createdUser.toJSON();
}

export async function getAssignedUsers(id) {
    const test = await Test.findByPk(id, {
        include: [
            {
                model: User,
                as: "assignedUser",
                through: { attributes: [] },
                where: { role: 'student', isDeleted: false },
            },
        ],
    });
    return test.assignedUser;
}