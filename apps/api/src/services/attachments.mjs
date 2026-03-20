import { Attachment } from "../db/sequelize.mjs";

export async function getAttachment(id) {
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
        const error = new Error(`Pièce jointe introuvable.`);
        error.status = 404;
        throw error;
    }
    return attachment;
}

export async function createAttachment(body, content) {
    const payload = {
        fileName: body.fileName,
        fileContent: content,
        isDeleted: false,
        idTest: parseInt(body.idTest, 10),
    };
    const attachment = await Attachment.create(payload);
    return attachment;
}

export async function archiveAttachment(id) {
    const archiveAttachment = await Attachment.findByPk(id);
    if (!archiveAttachment) {
        const error = new Error(`Pièce jointe introuvable.`);
        error.status = 404;
        throw error;
    }

    const attachment = await archiveAttachment.update({ isDeleted: true });
    return attachment;
}

export async function deleteAttachment(id) {
    const attachmentToDelete = await Attachment.findByPk(id);
    if (!attachmentToDelete) {
        const error = new Error(`Pièce jointe introuvable.`);
        error.status = 404;
        throw error;
    }
    const deletedAttachment = await attachmentToDelete.destroy();
    return deletedAttachment;
}

export async function editAttachment(id, body) {
    const attachmentToUpdate = await Attachment.findByPk(id);
    if (!attachmentToUpdate) {
        const error = new Error(`Pièce jointe introuvable.`);
        error.status = 404;
        throw error;
    }

    const payload = {
        fileName: body.fileName,
        isDeleted: body.isDeleted,
    };
    const attachmentUpdated = await attachmentToUpdate.update(payload);
    return attachmentUpdated;
}