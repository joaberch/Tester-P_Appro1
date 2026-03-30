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
        
        const dummyHash = "$2a$12$BAFWG0WxIHi6/WUm0Zt2IOMEKw.OM8iEbuooF3AgsgVEQOu2Qq0kq";
        const user = await User.findOne({ where: { login: body.login } });
        const passwordValid = await bcrypt.compare(body.password + process.env.PEPPER, user.hashedPassword || dummyHash);
        const isValid = user && passwordValid;
        if (!user || !isValid) {
            const error = new Error(`Identifiants invalides.`);
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