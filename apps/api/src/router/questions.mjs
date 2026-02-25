import express from "express";
import { success } from "../helper.mjs";
import { Answer, Question } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";

const questionsRouter = express();

//Get all questions
questionsRouter.get("/", auth, authorizeRoles("admin", "teacher"), (req, res) => { //TODO if useful
    Question.findAll().then((questions) => {
        const message = "Toutes les questions ont été récupérés.";
        res.json(success(message, questions))
    })
})

//Get a specific question
questionsRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => { //TODO if useful (already have all questions of a test)
    try {
        const questionId = req.params.id;
        const question = await Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }

        const message = `La question avec l'id ${question.idQuestion} a été récupéré.`;
        res.json(success(message, question));
    } catch (error) {
        return res.status(500).json({ message: "La question n'a pas pu être récupéré."});
    }
});

//Get all answers of a question
questionsRouter.get("/:id/answers", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => { //TODO - if user has test assigned and question type is QCM
    try {
        const questionId = req.params.id;
        const answers = await Answer.findAll({
            where: {
                idQuestion: questionId,
            }
        });

        const message = `Les réponses de la question ${questionId} ont bien été récupéré.`;
        res.json(success(message, answers));
    } catch (error) {
        res.status(500).json({ message: "Les réponses n'ont pas pu être récupéré.", data: error.message });
    }
})

//Create a question
questionsRouter.post("/", auth, authorizeRoles("admin", "teacher"), (req, res) => {
    Question.create(req.body).then((createdQuestion) => {
        const message = `La question ${createdQuestion.question} a été créé.`;
        res.json(success(message, createdQuestion));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "La question n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate a question
questionsRouter.put("/archivate/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    const questionId = req.params.id;
    let archivateQuestion = await Question.findByPk(questionId);

    if (!archivateQuestion) {
        return res.status(404).json({ message: "Question non trouvé" });
    }

    await archivateQuestion.update({ isDeleted: true }).then((_) => {
        const message = `La question ${archivateQuestion.question} a bien été supprimé (archivé).`;
        res.json(success(message, archivateQuestion));
    });
});

//Delete a question
questionsRouter.delete("/:id", auth, authorizeRoles("admin"), async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const deletedQuestion = await question.destroy();

        const message = `La question avec l'id ${deletedQuestion.idQuestion} a été supprimé.`;
        res.json(success(message, deletedQuestion));
    } catch (error) {
        if (error.name == "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Impossible de supprimer ce question car il est encore lié à d'autres tables.", data: error });
        }
        const message = "La question n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    }
});

//Edit a question
questionsRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const updatedQuestion = await question.update(req.body);

        const message = `La question avec l'id ${updatedQuestion.idQuestion} a été modifié.`;
        res.json(success(message, updatedQuestion));
    } catch (error) {
        return res.status(500).json({ message: "La question n'a pas pu être modifié."});
    }
});

export { questionsRouter };