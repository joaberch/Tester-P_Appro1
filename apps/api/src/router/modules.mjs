import express from "express";
import { success } from "../helper.mjs";
import { Module, Test } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const modulesRouter = express();

//Get all modules
modulesRouter.get("/", (req, res) => {
    Module.findAll().then((modules) => {
        const message = "Tous les modules ont été récupérés.";
        res.json(success(message, modules))
    })
})

//Get a specific module
modulesRouter.get("/:id", async (req, res) => {
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

//Get all tests
modulesRouter.get("/:id/tests", async (req, res) => {
    try {
        const moduleId = req.params.id;
        const tests = await Test.findAll({
            where: {
                idModule: moduleId,
            }
        });

        const message = `Les tests du module ${moduleId} ont bien été récupéré.`;
        res.json(success(message, tests));
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tests" })
    }
})

//Create a module
modulesRouter.post("/", (req, res) => {
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
modulesRouter.put("/archivate/:id", async (req, res) => {
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

//Delete a module
modulesRouter.delete("/:id", async (req, res) => {
    try {
        const moduleId = req.params.id;
        const module = await Module.findByPk(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const deletedModule = await module.destroy();

        const message = `Le module ${deletedModule.name} a été supprimé.`;
        res.json(success(message, deletedModule))
    } catch (error) {
        if (error.name == "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Impossible de supprimer ce module car il est encore lié à d'autres tables.", data: error });
        }
        const message = "Le module n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error })
    }
});

//Edit a module
modulesRouter.put("/:id", async (req, res) => {
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