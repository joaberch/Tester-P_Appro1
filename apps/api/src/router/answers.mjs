import express from "express";
import { success } from "../helper.mjs";
import { Answer } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { auth } from "../auth/authMiddleware.mjs";

const answersRouter = express();

//Create an answer
answersRouter.post("/", auth, authorizeRoles("admin", "teacher"), (req, res) => {
    Answer.create(req.body).then((createdAnswer) => {
        const message = `La réponse ${createdAnswer.answer} a été créé.`;
        res.json(success(message, createdAnswer));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            
        }
        const message = "La réponse n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate a answer
answersRouter.put("/archivate/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    const answerId = req.params.id;
    let archivateAnswer = await Answer.findByPk(answerId);

    if (!archivateAnswer) {
        return res.status(404).json({ message: "Réponse non trouvé" });
    }

    await archivateAnswer.update({ isDeleted: true }).then((_) => {
        const message = `La réponse ${archivateAnswer.answer} a bien été supprimé (archivé).`;
        res.json(success(message, archivateAnswer));
    });
});

//Edit an answer
answersRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const answerId = req.params.id;
        const answerToUpdate = await Answer.findByPk(answerId);
        const updatedAnswer = await answerToUpdate.update(req.body);

        const message = `La réponse ${updatedAnswer.answer} avec l'id ${updatedAnswer.idAnswer} a été mis à jour.`;
        res.json(success(message, updatedAnswer));
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de la réponse.", data: error })
    }
});

export { answersRouter };