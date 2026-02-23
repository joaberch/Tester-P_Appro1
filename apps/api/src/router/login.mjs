import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";

const loginRouter = express();

loginRouter.post("/", (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (authorizationHeader) {
            const message = "Vous êtes déjà connecté.";
            return res.status(200).json({ message });
        }
        //TODO err if already connected
        const user = User.findOne({ where: { login: req.body.login } })
        if (!user) {
            const message = "L'utilisateur n'existe pas";
            return res.status(404).json({ message });
        }

        let isValid = bcrypt.compare(req.body.hashedPassword, user.hashedPassword);
        if (!isValid) {
            const message = "Le mot de passe est incorrect";
            return res.status(401).json({ message });
        }

        const token = jwt.sign({ userId: user.idUser }, privateKey, {
            expiresIn: "3m",
        });
        const message = "L'utilisateur est connecté."
        return res.json({ message, data: user, token })
    } catch (error) {
        const message = "L'utilisateur n'a pas pu être connecté."
        return res.json({ message, data: error.message });
    }
})

export { loginRouter };