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
            isDeleted: false,
        }
    }).then((students) => {
        const message = "Tous les étudiants ont été récupérés.";
        res.json(success(message, students));
    });
});

//Get all teachers
usersRouter.get("/teachers", auth, authorizeRoles("admin"), (req, res) => { //TODO - useful for teacher to get this info? In rapport
    User.findAll({
        where: {
            role: "teacher",
            isDeleted: false,
        }
    }).then((teachers) => {
        const message = "Tous les enseignants ont été récupérés.";
        res.json(success(message, teachers));
    });
});

//Update user to students
usersRouter.put("/student/:id", auth, authorizeRoles("admin"), async (req, res) => {
    const userId = req.params.id;
    let updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await updatedUser.update({ role: "student" }).then((_) => {
        const message = `L'utilisateur ${updatedUser.login} est maintenant un étudiant.`;
        res.json(success(message, updatedUser));
    });
});

//Update user to teachers
usersRouter.put("/teacher/:id", auth, authorizeRoles("admin"), async (req, res) => {
    const userId = req.params.id;
    let updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await updatedUser.update({ role: "teacher" }).then((_) => {
        const message = `L'utilisateur ${updatedUser.login} est maintenant un enseignant.`;
        res.json(success(message, updatedUser));
    });
});

//Update user to admin
usersRouter.put("/admin/:id", auth, authorizeRoles("admin"), async (req, res) => {
    const userId = req.params.id;
    let updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await updatedUser.update({ role: "admin" }).then((_) => {
        const message = `L'utilisateur ${updatedUser.login} est maintenant un administrateur.`;
        res.json(success(message, updatedUser));
    });
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

//Create student
usersRouter.post("/student", auth, authorizeRoles("admin"), async (req, res) => { //TODO - can teacher do?
    try {
        const studentData = {
            ...req.body,
            role: "student",
            isDeleted: false
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Mot de passe requis." });
        }
        studentData.hashedPassword = await bcrypt.hash(req.body.password, 12);

        const createdUser = await User.create(studentData);

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

//Create teacher
usersRouter.post("/teacher", auth, authorizeRoles("admin"), async (req, res) => {
    const teacherData = {
        ...req.body,
        role: "teacher",
        isDeleted: false
    }
    if (!req.body.password) {
        return res.status(400).json({ message: "Mot de passe requis." });
    }
    teacherData.hashedPassword = await bcrypt.hash(req.body.password, 12); //TODO (no err just for better readability)

    User.create(teacherData).then((createdUser) => {
        const { hashedPassword, ...safeUser } = createdUser.toJSON(); //Don't return the hashedPassword to the frontend
        const message = `L'utilisateur' ${safeUser.name} a été créé.`;
        res.json(success(message, safeUser));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "L'utilisateur n'a pas été créé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

export { usersRouter };