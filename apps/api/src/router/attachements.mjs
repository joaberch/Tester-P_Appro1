import express from "express";
import { success } from "../helper.mjs";
import { Attachement } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const attachementsRouter = express();

//Get a specific attachement
attachementsRouter.get("/:id", (req, res) => {
    Attachement.findByPk(req.params.id).then((attachement) => {
        const message = `La pièce jointe avec l'id ${attachement.idAttachement} a été récupéré.`;
        res.json(success(message, attachement));
    })
});

//Create an attachement
attachementsRouter.post("/", (req, res) => {
    Attachement.create(req.body).then((createdAttachement) => {
        const message = `La pièce jointe ${createdAttachement.name} a été créé.`;
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
        const message = `La pièce jointe ${archivateAttachement.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateAttachement));
    });
});

//Delete an attachement
attachementsRouter.delete("/:id", (req, res) => {
    Attachement.findByPk(req.params.id).then((deletedAttachement) => {
        Attachement.destroy({
            where: { idAttachement: deletedAttachement.idAttachement },
        }).then((_) => {
            const message = `La pièce jointe ${deletedAttachement.name} a été supprimé.`;
            res.json(success(message, deletedAttachement))
        }).catch((error) => {
            if (error.name == "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({message: "Impossible de supprimer cette pièce jointe car elle est encore lié à d'autres tables.", data: error});
            }
            const message = "La pièce jointe n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
            res.status(500).json({ message, data: error})
        });
    });
});

//Edit an attachement - TODO check use
attachementsRouter.put("/:id", (req, res) => {
    const attachementId = req.params.id;
    Attachement.update(req.body, { where: { idAttachement: attachementId } }).then((_) => {
        Attachement.findByPk(attachementId).then((updatedAttachement) => {
            const message = `La pièce jointe ${updatedAttachement.name} avec l'id ${updatedAttachement.idAttachement} a été mis à jour.`;
            res.json(success(message, updatedAttachement));
        });
    });
});

export { attachementsRouter };