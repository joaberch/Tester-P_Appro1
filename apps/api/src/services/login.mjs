import { User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { privateKey } from "../auth/private_key.mjs"

export async function login(authorizationHeader, body) {
    try {
        if (authorizationHeader) {
            const error = new Error(`Vous êtes déjà connecté.`);
            error.status = 200;
            throw error;
        }
        
        const user = await User.findOne({ where: { login: body.login } });
        if (!user) {
            const error = new Error(`L'utilisateur n'existe pas.`);
            error.status = 404;
            throw error;
        }

        let isValid = await bcrypt.compare(body.password + process.env.PEPPER, user.hashedPassword);
        if (!isValid) {
            const error = new Error(`Le mot de passe est incorrect.`);
            error.status = 401;
            throw error;
        }

        const payload = {
            userId: user.idUser,
            role: user.role,
        }
        const token = jwt.sign(payload, privateKey, {
            expiresIn: "24h",
        });

        return token
    } catch (err) {
        if (err.status) {
            throw err;
        }
        const error = new Error(`L'utilisateur n'a pas pu être connecté. ${err}`);
        error.status = 500;
        error.data = err.message;
        throw error
    }
}