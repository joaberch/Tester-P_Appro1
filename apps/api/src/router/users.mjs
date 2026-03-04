import express from "express";
import { success } from "../helper.mjs";
import { User } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import bcrypt from "bcrypt";

const usersRouter = express();

//Get all students
usersRouter.get("/students", auth, authorizeRoles("admin", "teacher"), (req, res) => {
    User.findAll({
        where: {
            role: "student",
            isDeleted: false, //TODO don't return hashedPassword
        }
    }).then((students) => {
        const message = "Tous les étudiants ont été récupérés.";
        res.json(success(message, students));
    });
});

//Get all users
usersRouter.get("/", auth, authorizeRoles("admin"), (req, res) => {
    User.findAll({
    }).then((teachers) => {
        const message = "Tous les utilisateurs ont été récupérés."; //TODO don't return hashedPassword
        res.json(success(message, teachers));
    });
});

//Update user
usersRouter.put("/:id", auth, authorizeRoles("admin"), async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
    
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    
        await user.update(req.body); //TODO prevent hashedPassword to be edited?

        const message = `L'utilisateur ${user.login} a été modifié.`;
        res.json(success(message, user));
    } catch (error) {
        console.error("Erreur:", error)
    }
});

//Archivate an user
usersRouter.put("/archivate/:id", auth, authorizeRoles("admin"), async (req, res) => { //TODO - can teacher do this? Only to student? - TODO in rapport
    const userId = req.params.id;
    let updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await updatedUser.update({ isDeleted: true }).then((_) => {
        const message = `L'utilisateur ${updatedUser.login} est maintenant désactivé.`;
        res.json(success(message, updatedUser));
    });
});

//Create user
usersRouter.post("/", auth, authorizeRoles("admin"), async (req, res) => { //TODO - can teacher do?
    try {
        const userData = {
            ...req.body,
            isDeleted: false
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Mot de passe requis." });
        }
        userData.hashedPassword = await bcrypt.hash(req.body.password, 12);

        const createdUser = await User.create(userData);

        const { hashedPassword, ...safeUser } = createdUser.toJSON();
        const message = `L'utilisateur' ${safeUser.name} a été créé.`;
        res.json(success(message, safeUser));
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "L'utilisateur n'a pas été créé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error.message });
    }
});

export { usersRouter };