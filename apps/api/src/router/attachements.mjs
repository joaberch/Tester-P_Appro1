import express from "express";
import { success } from "../helper.mjs";
import { Attachement } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const attachementsRouter = express();

//Get a specific attachement
attachementsRouter.get("/:id", async (req, res) => {
    try {
        const attachementId = req.params.id;
        let attachement = await Attachement.findByPk(attachementId);

        if (!attachement) {
            return res.status(404).json({ message: "Pièce jointe non trouvé" });
        }
        
        const message = `La pièce jointe ${attachement.idAttachement} a été récupéré.`;
        res.json(success(message, attachement))
    } catch (error) {
        const message = "La pièce jointe n'a pas pu être récupéré.";
        res.status(500).json({ message, data: error.message })
    }
});

//Create an attachement
attachementsRouter.post("/", (req, res) => {
    Attachement.create(req.body).then((createdAttachement) => {
        const message = `La pièce jointe ${createdAttachement.idAttachement} a été créé.`;
        res.json(success(message, createdAttachement));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "La pièce jointe n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Archivate an attachement
attachementsRouter.put("/archivate/:id", async (req, res) => {
    const attachementId = req.params.id;
    let archivateAttachement = await Attachement.findByPk(attachementId);

    if (!archivateAttachement) {
        return res.status(404).json({ message: "Pièce jointe non trouvé" });
    }

    await archivateAttachement.update({ isDeleted: true }).then((_) => {
        const message = `La pièce jointe ${archivateAttachement.idAttachement} a bien été supprimé (archivé).`;
        res.json(success(message, archivateAttachement));
    });
});

//Delete an attachement
attachementsRouter.delete("/:id", async (req, res) => {
    try {
        const attachementId = req.params.id;
        const attachementToDelete = await Attachement.findByPk(attachementId);
        if (!attachementToDelete) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const deletedAttachement = await attachementToDelete.destroy();

        const message = `La pièce jointe ${deletedAttachement.idAttachement} a été supprimé.`;
        res.json(success(message, deletedAttachement));
    } catch (error) {
        if (error.name == "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Impossible de supprimer cette pièce jointe car elle est encore lié à d'autres tables.", data: error });
        }
        const message = "La pièce jointe n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error.message })
    }
});

//Edit an attachement
attachementsRouter.put("/:id", async (req, res) => {
    try {
        const attachementId = req.params.id;
        const attachementToUpdate = await Attachement.findByPk(attachementId);
        if (!attachementToUpdate) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }
        const attachementUpdated = await attachementToUpdate.update(req.body);
        const message = `La pièce jointe ${attachementUpdated.idAttachement} avec l'id ${attachementUpdated.idAttachement} a été mis à jour.`;
        res.json(success(message, attachementUpdated));
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de la pièce jointe.", data: error })
    }
});

export { attachementsRouter };