import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";
import dotenv from "dotenv";
dotenv.config();

const loginRouter = express();

loginRouter.post("/", async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (authorizationHeader) {
            const message = "Vous êtes déjà connecté.";
            return res.status(200).json({ message });
        }
        //TODO err if already connected and work with wrong pwd
        const user = await User.findOne({ where: { login: req.body.login } });
        if (!user) {
            const message = "L'utilisateur n'existe pas";
            return res.status(404).json({ message });
        }

        let isValid = await bcrypt.compare(req.body.password + process.env.PEPPER, user.hashedPassword);
        if (!isValid) {
            const message = "Le mot de passe est incorrect";
            return res.status(401).json({ message });
        }

        const payload = {
            userId: user.idUser,
            role: user.role,
        }
        const token = jwt.sign(payload, privateKey, {
            expiresIn: "24h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE,
            sameSite: process.env.COOKIE_SAMESITE
        });

        const message = "L'utilisateur est connecté."
        return res.json({ message, data: user.login })
    } catch (error) {
        const message = "L'utilisateur n'a pas pu être connecté."
        return res.status(500).json({ message, data: error.message });
    }
})

export { loginRouter };