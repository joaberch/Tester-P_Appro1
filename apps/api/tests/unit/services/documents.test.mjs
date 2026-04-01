import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../../src/db/sequelize.mjs', () => ({
    Document: {
        findAll: jest.fn(),
    },
}));

const { Document } = await import("../../../src/db/sequelize.mjs");
const { getDocuments } = await import("../../../src/services/documents.mjs");

describe('Document Service', () => {
    describe('getDocuments', () => {
        it('should get all documents not archived', async () => {
            const documents = [
                { idDocument: "1", name: "document1", content: "blob content", isDeleted: false },
                { idDocument: "2", name: "archived_document", content: "archived blob content", isDeleted: true },
            ];
            Document.findAll.mockImplementation(({where}) => {
                return Promise.resolve(documents.filter(doc => doc.isDeleted == where.isDeleted));
            });

            const result = await getDocuments();

            expect(result).toHaveLength(1);
            expect(Document.findAll).toHaveBeenCalledWith({
                where: { isDeleted: false },
            });
        });
    });
});