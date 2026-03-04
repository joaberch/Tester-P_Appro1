import express from "express";
import { success } from "../helper.mjs";
import { Answer } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { auth } from "../auth/authMiddleware.mjs";

const answersRouter = express();

//Get all answers
answersRouter.get("/", auth, authorizeRoles("admin", "teacher"), (req, res) => { //TODO - check if useful
    Answer.findAll().then((answers) => {
        const message = "Toutes les réponses ont été récupérés.";
        res.json(success(message, answers))
    })
})

//Get a specific answer
answersRouter.get("/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => { //TODO - check if useful
    try {
        const answers = await Answer.findByPk(req.params.id);
        if (answers == null) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const message = `La réponse avec l'id ${answers.idAnswer} a été récupéré.`;
        res.json(success(message, answers));
    } catch(error) {
        res.status(500).json({ message: error.message, data: error });
    }
});

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

//Delete an answer
answersRouter.delete("/:id", auth, authorizeRoles("admin"), async (req, res) => {
    try {
        const deletedAnswer = await Answer.findByPk(req.params.id);
        if (!deletedAnswer) {
            return res.status(404).json({ message: "Ressource introuvable."})
        }
        deletedAnswer.destroy();

        const message = `La réponse ${deletedAnswer.answer} a bien été supprimé.`;
        res.json(success(message, deletedAnswer));
    } catch (error) {
        if (error.name == "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Impossible de supprimer cette réponse car elle est encore lié à d'autres tables.", data: error });
        }
        const message = "La réponse n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error.message })
    }
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