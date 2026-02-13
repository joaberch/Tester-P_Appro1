import express from "express";
import { success } from "../helper.mjs";
import { User } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const usersRouter = express();

//Get all students
usersRouter.get("/students", (req, res) => {
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
usersRouter.get("/teachers", (req, res) => {
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
usersRouter.put("/student/:id", async (req, res) => {
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
usersRouter.put("/teacher/:id", async (req, res) => {
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
usersRouter.put("/admin/:id", async (req, res) => {
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
usersRouter.put("/archivate/:id", async (req, res) => {
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
usersRouter.post("/student", (req, res) => {
    const studentData = {
        ...req.body,
        role: "student",
        isDeleted: false
    }

    User.create(studentData).then((createdUser) => {
        const message = `L'utilisateur' ${createdUser.name} a été créé.`;
        res.json(success(message, createdUser));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "L'utilisateur n'a pas été créé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Create teacher
usersRouter.post("/teacher", (req, res) => {
    const teacherData = {
        ...req.body,
        role: "teacher",
        isDeleted: false
    }

    User.create(teacherData).then((createdUser) => {
        const message = `L'utilisateur' ${createdUser.name} a été créé.`;
        res.json(success(message, createdUser));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "L'utilisateur n'a pas été créé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

export { usersRouter };