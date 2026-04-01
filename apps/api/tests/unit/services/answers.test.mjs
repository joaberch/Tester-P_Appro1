import { afterEach, describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../../src/db/sequelize.mjs', () => ({
    Answer: {
        create: jest.fn(),
        findByPk: jest.fn()
    },
    Question: {
        findByPk: jest.fn()
    }
}));

const { createAnswer, archiveAnswer, editAnswer } = await import('../../../src/services/answers.mjs');
const { Answer, Question } = await import('../../../src/db/sequelize.mjs');

describe('Answer Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAnswer', () => {
        it('should create an answer if question exists', async () => {
            Question.findByPk.mockResolvedValue({ id: 1 });
            Answer.create.mockResolvedValue({ id: 10 });

            const result = await createAnswer({ idQuestion: 1 });

            expect(Question.findByPk).toHaveBeenCalledWith(1);
            expect(Answer.create).toHaveBeenCalled();
            expect(result).toEqual({ id: 10 });
        });

        it('should throw 404 if question doesn\'t exist', async () => {
            Question.findByPk.mockResolvedValue(null);

            await expect(createAnswer({ idQuestion: 1 })).rejects.toMatchObject({ status: 404 });
        });
    });

    describe('archiveAnswer', () => {
        it('should archive an answer', async () => {
            const mockUpdate = jest.fn().mockResolvedValue({ isDeleted: true });

            Answer.findByPk.mockResolvedValue({
                update: mockUpdate
            });

            const result = await archiveAnswer(1);

            expect(mockUpdate).toHaveBeenCalledWith({ isDeleted: true });
            expect(result).toEqual({ isDeleted: true });
        });

        it('should throw 404 if answer not found', async () => {
            Answer.findByPk.mockResolvedValue(null);

            await expect(archiveAnswer(1)).rejects.toMatchObject({ status: 404 });
        });
    });
});

describe('editAnswer', () => {
    it('should update an answer', async () => {
        const mockUpdate = jest.fn().mockResolvedValue({ answer: 'updated' });

        Answer.findByPk.mockResolvedValue({
            update: mockUpdate
        });

        const result = await editAnswer(1, { answer: 'updated' });

        expect(mockUpdate).toHaveBeenCalledWith({ answer: 'updated' });
        expect(result).toEqual({ answer: 'updated' });
    });

    it('should throw 404 if answer not found', async () => {
        Answer.findByPk.mockResolvedValue(null);

        await expect(editAnswer(1)).rejects.toMatchObject({ status: 404 });
    });
})