import express from "express";
import { success } from "../helper.mjs";
import { Objective } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";

const objectivesRouter = express();

//Get all objectives of module
objectivesRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => {
    try {
        const id = req.query.idModule;
        if (!id) {
            return res.status(400).json({ message: "Query not found. Specify a module id." })
        }

        const objectives = await Objective.findAll({
            where: { idModule: id }
        })
        const message = "Tous les objectifs ont été récupérés.";
        res.json(success(message, objectives));
    } catch (error) {
        console.error("Erreur:", error)
    }
});

//Create an objective
objectivesRouter.post("/", auth, authorizeRoles("admin", "teacher"), (req, res) => {
    Objective.create(req.body).then((createdObjective) => {
        const message = `L'objectif ${createdObjective.name} a été créé.`;
        res.json(success(message, createdObjective));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "L'objectif n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate an objective
objectivesRouter.put("/archivate/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    const objectiveId = req.params.id;
    let archivateObjective = await Objective.findByPk(objectiveId);

    if (!archivateObjective) {
        return res.status(404).json({ message: "Objectif non trouvé" });
    }

    await archivateObjective.update({ isDeleted: true }).then((_) => {
        const message = `L'objectif ${archivateObjective.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateObjective));
    });
});

//Edit an objective
objectivesRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const objectiveId = req.params.id;
        const objective = await Objective.findByPk(objectiveId);
        if (!objective) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const updatedObjective = await objective.update(req.body);

        const message = `Le module ${updatedObjective.name} a été modifié.`;
        res.json(success(message, updatedObjective))
    } catch (error) {
        const message = "L'objectif n'a pas pu être modifié.";
        res.status(500).json({ message, data: error.message })
    }
});

export { objectivesRouter };