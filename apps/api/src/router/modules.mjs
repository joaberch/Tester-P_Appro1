import express from "express";
import { success } from "../helper.mjs";
import { Module, Test } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";

const modulesRouter = express();

//Get all modules
modulesRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), (req, res) => {
    Module.findAll().then((modules) => {
        const message = "Tous les modules ont été récupérés.";
        res.json(success(message, modules))
    })
})

//Get a specific module
modulesRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => {
    try {
        const moduleId = req.params.id;
        const module = await Module.findByPk(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }

        const message = `Le module avec l'id ${module.idModule} a été récupéré.`;
        res.json(success(message, module));
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération du module." })
    }
});

//Create a module
modulesRouter.post("/", auth, authorizeRoles("admin", "teacher"), (req, res) => {
    Module.create(req.body).then((createdModule) => {
        const message = `Le module ${createdModule.name} a été créé.`;
        res.json(success(message, createdModule));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "Le module n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate a module
modulesRouter.put("/archivate/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    const moduleId = req.params.id;
    let archivateModule = await Module.findByPk(moduleId);

    if (!archivateModule) {
        return res.status(404).json({ message: "Module non trouvé" });
    }

    await archivateModule.update({ isDeleted: true }).then((_) => {
        const message = `Le module ${archivateModule.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateModule));
    });
});

//Edit a module
modulesRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const moduleId = req.params.id;
        const module = await Module.findByPk(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const updatedModule = await module.update(req.body);

        const message = `Le module ${updatedModule.name} a été modifié.`;
        res.json(success(message, updatedModule))
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la modification du module", data: error })
    }
});

export { modulesRouter };