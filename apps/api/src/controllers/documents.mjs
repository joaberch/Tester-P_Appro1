import * as documentsService from "../services/documents.mjs";

export async function getDocuments(req, res) {
    const documents = await documentsService.getDocuments();
    res.status(200).json(documents);
}