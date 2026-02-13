import express from "express";
import { success } from "../helper.mjs";
import { Objective } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const objectivesRouter = express();

//Get all objectives
objectivesRouter.get("/", (req, res) => {
    Objective.findAll().then((objectives) => {
        const message = "Tous les objectifs ont été récupérés.";
        res.json(success(message, objectives))
    })
})

//Get a specific objective
objectivesRouter.get("/:id", async (req, res) => {
    try {
        const objectiveId = req.params.id;
        const objective = await Objective.findByPk(objectiveId);
        if (!objective) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }

        const message = `L'objectif avec l'id ${objective.idObjective} a été récupéré.`;
        res.json(success(message, objective));
    } catch (error) {
        return res.status(500).json({ message: "L'objectif n'a pas pu être récupéré."})
    }
});

//Create an objective
objectivesRouter.post("/", (req, res) => {
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
objectivesRouter.put("/archivate/:id", async (req, res) => {
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

//Delete an objective
objectivesRouter.delete("/:id", async (req, res) => {
    try {
        const objectiveId = req.params.id;
        const objective = await Objective.findByPk(objectiveId);
        if (!objective) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const deletedObjective = await objective.destroy();

        const message = `L'objectif ${deletedObjective.name} a été supprimé.`;
        res.json(success(message, deletedObjective))
    } catch (error) {
        if (error.name == "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Impossible de supprimer cet objectif car il est encore lié à d'autres tables.", data: error });
        }
        const message = "L'objectif n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error })
    }
});

//Edit an objective
objectivesRouter.put("/:id", async (req, res) => {
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