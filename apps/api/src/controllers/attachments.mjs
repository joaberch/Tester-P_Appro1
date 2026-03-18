import * as attachmentsService from "../services/attachments.mjs";

export async function getAttachment(req, res) {
    try {
        const attachment = await attachmentsService.getAttachment(req.params.id);
        res.status(200).json(attachment);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function createAttachment(req, res) {
    try {
        const attachment = await attachmentsService.createAttachment(req.body);
        res.status(201).json(attachment);
    } catch (err) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveAttachment(req, res) {
    try {
        const attachment = await attachmentsService.archiveAttachment(req.params.id);
        res.status(200).json(attachment);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function deleteAttachment(req, res) {
    try {
        const attachment = await attachmentsService.deleteAttachment(req.params.id);
        res.status(200).json(attachment);
    } catch (err) {
        if (err.name == "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Impossible de supprimer cette pièce jointe car elle est encore lié à d'autres tables.", data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function editAttachment(req, res) {
    try {
        const attachment = await attachmentsService.editAttachment(req.params.id, req.body);
        res.status(200).json(attachment);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}