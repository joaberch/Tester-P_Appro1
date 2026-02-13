import express from "express";
import { success } from "../helper.mjs";
import { Question } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const questionsRouter = express();

//Get all questions
questionsRouter.get("/", (req, res) => {
    Question.findAll().then((questions) => {
        const message = "Tous les questions ont été récupérés.";
        res.json(success(message, questions))
    })
})

//Get a specific question
questionsRouter.get("/:id", (req, res) => {
    Question.findByPk(req.params.id).then((question) => {
        const message = `Le question avec l'id ${question.idQuestion} a été récupéré.`;
        res.json(success(message, question));
    })
});

//Create a question
questionsRouter.post("/", (req, res) => {
    Question.create(req.body).then((createdQuestion) => {
        const message = `Le question ${createdQuestion.name} a été créé.`;
        res.json(success(message, createdQuestion));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "Le question n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate a question
questionsRouter.put("/archivate/:id", async (req, res) => {
    const questionId = req.params.id;
    let archivateQuestion = await Question.findByPk(questionId);

    if (!archivateQuestion) {
        return res.status(404).json({ message: "Question non trouvé" });
    }

    await archivateQuestion.update({ isDeleted: true }).then((_) => {
        const message = `Le question ${archivateQuestion.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateQuestion));
    });
});

//Delete a question
questionsRouter.delete("/:id", (req, res) => {
    Question.findByPk(req.params.id).then((deletedQuestion) => {
        Question.destroy({
            where: { idQuestion: deletedQuestion.idQuestion },
        }).then((_) => {
            const message = `Le question ${deletedQuestion.name} a été supprimé.`;
            res.json(success(message, deletedQuestion))
        }).catch((error) => {
            if (error.name == "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({message: "Impossible de supprimer ce question car il est encore lié à d'autres tables.", data: error});
            }
            const message = "Le question n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
            res.status(500).json({ message, data: error})
        });
    });
});

//Edit a question
questionsRouter.put("/:id", (req, res) => {
    const questionId = req.params.id;
    Question.update(req.body, { where: { idQuestion: questionId } }).then((_) => {
        Question.findByPk(questionId).then((updatedQuestion) => {
            const message = `Le question ${updatedQuestion.name} avec l'id ${updatedQuestion.idQuestion} a été mis à jour.`;
            res.json(success(message, updatedQuestion));
        });
    });
});

export { questionsRouter };