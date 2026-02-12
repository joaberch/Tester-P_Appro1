import express from "express";
import { success } from "../helper.mjs";
import { Answer } from "../db/sequelize.mjs";

const answersRouter = express();

//Get all answers
answersRouter.get("/", (req, res) => {
    Answer.findAll().then((answers) => {
        const message = "Tous les answers ont été récupérés.";
        res.json(success(message, answers))
    })
})

//Get a specific answer
answersRouter.get("/:id", (req, res) => {
    Answer.findByPk(req.params.id).then((answer) => {
        const message = `Le answer avec l'id ${answer.idAnswer} a été récupéré.`;
        res.json(success(message, answer));
    })
});

//Create a answer
answersRouter.post("/", (req, res) => {
    Answer.create(req.body).then((idAnswer) => {
        const message = `Le answer ${createdAnswer.name} a été créé.`;
        res.json(success(message, createdAnswer));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "Le answer n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate a answer
answersRouter.put("/delete/:id", async (req, res) => {
    const answerId = req.params.id;
    let archivateAnswer = await Answer.findByPk(answerId);

    if (!archivateAnswer) {
        return res.status(404).json({ message: "Answer non trouvé" });
    }

    await archivateAnswer.update({ isDeleted: true }).then((_) => {
        const message = `Le answer ${archivateAnswer.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateAnswer));
    });
});

//Delete a answer
answersRouter.delete("/:id", (req, res) => {
    Answer.findByPk(req.params.id).then((deletedAnswer) => {
        Answer.destroy({
            where: { idAnswer: deletedAnswer.idAnswer },
        }).then((_) => {
            const message = `Le answer ${deletedAnswer.name} a été supprimé.`;
            res.json(success(message, deletedAnswer))
        }).catch((error) => {
            if (error.name == "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({message: "Impossible de supprimer ce answer car il est encore lié à d'autres tables.", data: error});
            }
            const message = "Le answer n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
            res.status(500).json({ message, data: error})
        });
    });
});

//Edit a answer
answersRouter.put("/:id", (req, res) => {
    const answerId = req.params.id;
    Answer.update(req.body, { where: { idAnswer: answerId } }).then((_) => {
        Answer.findByPk(answerId).then((updatedAnswer) => {
            const message = `Le answer ${updatedAnswer.name} avec l'id ${updatedAnswer.idAnswer} a été mis à jour.`;
            res.json(success(message, updatedAnswer));
        });
    });
});

export { answersRouter };