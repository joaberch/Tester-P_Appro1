import express from "express";
import { success } from "../helper.mjs";
import { Objective } from "../db/sequelize.mjs";

const objectivesRouter = express();

//Get all objectives
objectivesRouter.get("/", (req, res) => {
    Objective.findAll().then((objectives) => {
        const message = "Tous les objectives ont été récupérés.";
        res.json(success(message, objectives))
    })
})

//Get a specific objective
objectivesRouter.get("/:id", (req, res) => {
    Objective.findByPk(req.params.id).then((objective) => {
        const message = `Le objective avec l'id ${objective.idObjective} a été récupéré.`;
        res.json(success(message, objective));
    })
});

//Create an objective
objectivesRouter.post("/", (req, res) => {
    Objective.create(req.body).then((createdObjective) => {
        const message = `Le objective ${createdObjective.name} a été créé.`;
        res.json(success(message, createdObjective));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "Le objective n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate an objective
objectivesRouter.put("/archivate/:id", async (req, res) => {
    const objectiveId = req.params.id;
    let archivateObjective = await Objective.findByPk(objectiveId);

    if (!archivateObjective) {
        return res.status(404).json({ message: "Objective non trouvé" });
    }

    await archivateObjective.update({ isDeleted: true }).then((_) => {
        const message = `Le objective ${archivateObjective.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateObjective));
    });
});

//Delete an objective
objectivesRouter.delete("/:id", (req, res) => {
    Objective.findByPk(req.params.id).then((deletedObjective) => {
        Objective.destroy({
            where: { idObjective: deletedObjective.idObjective },
        }).then((_) => {
            const message = `Le objective ${deletedObjective.name} a été supprimé.`;
            res.json(success(message, deletedObjective))
        }).catch((error) => {
            if (error.name == "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({message: "Impossible de supprimer ce objective car il est encore lié à d'autres tables.", data: error});
            }
            const message = "Le objective n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
            res.status(500).json({ message, data: error})
        });
    });
});

//Edit an objective
objectivesRouter.put("/:id", (req, res) => {
    const objectiveId = req.params.id;
    Objective.update(req.body, { where: { idObjective: objectiveId } }).then((_) => {
        Objective.findByPk(objectiveId).then((updatedObjective) => {
            const message = `Le objective ${updatedObjective.name} avec l'id ${updatedObjective.idObjective} a été mis à jour.`;
            res.json(success(message, updatedObjective));
        });
    });
});

export { objectivesRouter };