import { User } from "../db/sequelize.mjs";

export async function getUser(oid) {
    const user = await User.findOne({
        where: { azureOid: oid }
    })

    if (!user) {
        const error = new Error(`Utilisateur introuvable`);
        error.status = 404;
        throw error;
    }

    return {
        id: user.idUser,
        login: user.login,
        role: user.role,
        name: user.name,
        firstname: user.firstname,
        isDeleted: user.isDeleted,
    }
}