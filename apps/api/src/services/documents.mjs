import { Document } from "../db/sequelize.mjs"

export async function getDocuments() {
    const documents = await Document.findAll({
        where: {
            isDeleted: false,
        }
    });

    return documents;
}