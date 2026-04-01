import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../../src/db/sequelize.mjs', () => ({
    Attachment: {
        create: jest.fn(),
        findByPk: jest.fn(),
    },
    Test: {
        findByPk: jest.fn(),
    }
}));

const { Attachment, Test } = await import("../../../src/db/sequelize.mjs");
const { createAttachment, archiveAttachment, deleteAttachment, editAttachment } = await import("../../../src/services/attachments.mjs");

describe('Attachment Service', () => {
    describe('createAttachment', () => {
        it('should create an attachment on test exist', async () => {
            const body = { fileName: 'test.pdf', idTest: '1' };
            const content = 'file content';

            const mockAttachment = { id: 1, ...body, fileContent: content, isDeleted: false };
            Attachment.create.mockResolvedValue(mockAttachment);
            Test.findByPk.mockResolvedValue({ id: 1 });

            const result = await createAttachment(body, content);

            expect(Attachment.create).toHaveBeenCalledWith({
                fileName: 'test.pdf',
                fileContent: content,
                isDeleted: false,
                idTest: 1,
            });
            expect(result).toEqual(mockAttachment);
        });

        it('should throw 404 on test not found', async () => {
            const body = { fileName: 'test.pdf', idTest: 1000 };
            Test.findByPk.mockResolvedValue(null);
            await expect(createAttachment(body, 'content123')).rejects.toMatchObject({ status: 404 });
        });

        it('should throw 400 on empty content', async () => {
            const body = { fileName: 'test.pdf', idTest: 1 };
            await expect(createAttachment(body, null)).rejects.toMatchObject({ status: 400 });
        });
    });

    describe('archiveAttachment', () => {
        it('should update an attachment on test exist', async () => {
            const id = 1;
            const mockAttachment = {
                idAttachment: id,
                fileName: 'test.pdf',
                isDeleted: false,
                update: jest.fn().mockResolvedValue({ idAttachment: id, fileName: 'test.pdf', isDeleted: true })
            }
            Attachment.findByPk.mockResolvedValue(mockAttachment);

            const result = await archiveAttachment(id);

            expect(mockAttachment.update).toHaveBeenCalledWith({ isDeleted: true });
            expect(result).toEqual({ idAttachment: id, fileName: 'test.pdf', isDeleted: true });
        });

        it('should throw 404 on attachment not found', async () => {
            const id = 1;
            Attachment.findByPk.mockResolvedValue(null);
            await expect(archiveAttachment(id)).rejects.toMatchObject({ status: 404 });
        });
    });

    describe('deleteAttachment', () => {
        it('should delete the attachment', async () => {
            const id = 1;
            const mockAttachment = {
                idAttachment: id,
                fileName: 'test.pdf',
                isDeleted: false,
                destroy: jest.fn().mockResolvedValue({ })
            }
            Attachment.findByPk.mockResolvedValue(mockAttachment);

            const result = await deleteAttachment(id);

            expect(mockAttachment.destroy).toHaveBeenCalledWith();
            expect(result).toEqual({})
        });

        it('should throw 404 on attachment not found', async () => {
            const id = 1;
            Attachment.findByPk.mockResolvedValue(null);
            await expect(deleteAttachment(id)).rejects.toMatchObject({ status: 404 });
        });
    });

    describe('editAttachment', () => {
        it('should update the attachment', async () => {
            const id = 1;
            const fileName = 'test.pdf';
            const isDeleted = false;

            const mockAttachment = {
                idAttachment: id,
                fileName: 'test.old.pdf',
                isDeleted: false,
                update: jest.fn().mockResolvedValue({ idAttachment: id, fileName: fileName, isDeleted: isDeleted })
            }
            const body = {
                fileName: fileName,
                isDeleted: isDeleted,
            }
            Attachment.findByPk.mockResolvedValue(mockAttachment);

            const result = await editAttachment(id, body);

            expect(mockAttachment.update).toHaveBeenCalledWith({
                fileName: fileName,
                isDeleted: isDeleted,
            });
            expect(result).toEqual({ idAttachment: id, fileName: fileName, isDeleted: isDeleted });
        });

        it('should throw 404 on attachment not found', async () => {
            const id = 1;
            Attachment.findByPk.mockResolvedValue(null);
            await expect(editAttachment(id)).rejects.toMatchObject({ status: 404 });
        })
    });
})