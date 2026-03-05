import express from "express";
import { success } from "../helper.mjs";
import { Answer, Question } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";

const questionsRouter = express();

//Get all answers of a question
questionsRouter.get("/:id/answers", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => { //TODO - if user has test assigned and question type is checkbox
    try {
        const questionId = req.params.id;
        let answers;

        if (req.user.role == "student") {
            answers = await Answer.findAll({
                where: {
                    idQuestion: questionId,
                },
                attributes: {
                    exclude: ["isCorrect"]
                }
            });
        } else {
            answers = await Answer.findAll({
                where: {
                    idQuestion: questionId,
                }
            });
        }

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