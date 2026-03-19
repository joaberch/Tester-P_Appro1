import * as attachmentsService from "../services/attachments.mjs";

export async function getAttachment(req, res) {
    const attachment = await attachmentsService.getAttachment(req.params.id);
    res.status(200).json(attachment);
}

export async function createAttachment(req, res) {
    const attachment = await attachmentsService.createAttachment(req.body);
    res.status(201).json(attachment);
}

export async function archiveAttachment(req, res) {
    const attachment = await attachmentsService.archiveAttachment(req.params.id);
    res.status(200).json(attachment);
}

export async function deleteAttachment(req, res) {
    const attachment = await attachmentsService.deleteAttachment(req.params.id);
    res.status(200).json(attachment);
}

export async function editAttachment(req, res) {
    const attachment = await attachmentsService.editAttachment(req.params.id, req.body);
    res.status(200).json(attachment);
}