import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../../src/db/sequelize.mjs', () => ({
    Module: {
        findByPk: jest.fn()
    },
    Objective: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
    }
}));

const { getObjectivesOfModule, createObjective, archiveObjective, editObjective } = await import('../../../src/services/objectives.mjs');
const { Objective, Module } = await import('../../../src/db/sequelize.mjs');

describe('Objectives Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    }
);

    describe('getObjectivesOfModule', () => {
        it('should get the current objectives of a module', async () => {
            const objectives = [
                { idObjective: "1", name: "MCD", description: "Être capable de...", bloomLevel: 4, isDeleted: false, idModule: 1 },
                { idObjective: "2", name: "MLD", description: "Être capable de...", bloomLevel: 4, isDeleted: false, idModule: 1 },
                { idObjective: "2", name: "MPD", description: "Être capable de...", bloomLevel: 4, isDeleted: true, idModule: 1 },
            ];
            const modules = [
                { idModule: "1", name: "DB", description: "Intro...", isDeleted: false }
            ];
            Module.findByPk.mockResolvedValue(modules[0]);
            Objective.findAll.mockImplementation(({ where }) => {
                return Promise.resolve(objectives.filter(o => o.idModule == where.idModule && o.isDeleted == where.isDeleted))
            });

            const res = await getObjectivesOfModule(1);

            expect(Module.findByPk).toHaveBeenCalledWith(1);
            expect(Objective.findAll).toHaveBeenCalledWith({
                where: {
                    idModule: 1,
                    isDeleted: false
                }
            });
            expect(res).toEqual([
                { idObjective: "1", name: "MCD", description: "Être capable de...", bloomLevel: 4, isDeleted: false, idModule: 1 },
                { idObjective: "2", name: "MLD", description: "Être capable de...", bloomLevel: 4, isDeleted: false, idModule: 1 }
            ]);
        });
        it('should throw 404 if module not found', async () => {
            Module.findByPk.mockResolvedValue(null);

            await expect(getObjectivesOfModule(4)).rejects.toMatchObject({
                message: "Aucun module ne correspond à l'identifiant rentré.",
                status: 404
            });
            expect(Objective.findAll).not.toHaveBeenCalled();
        });
        it('should return empty if no objective exists', async () => {
            const objectives = [];
            const module = { idModule: "1", name: "DB", description: "Intro...", isDeleted: false };
            Module.findByPk.mockResolvedValue(module);
            Objective.findAll.mockImplementation(({ where }) => {
                return Promise.resolve(objectives.filter(o => o.idModule == where.idModule && o.isDeleted == where.isDeleted))
            });

            const res = await getObjectivesOfModule(1);

            expect(Module.findByPk).toHaveBeenCalledWith(1);
            expect(Objective.findAll).toHaveBeenCalledWith({
                where: {
                    idModule: 1,
                    isDeleted: false
                }
            });
            expect(res).toEqual([]);
        });
    });

    describe('createObjective', () => {
        it('should create the objective', async () => {
            const module = { idModule: "1", name: "DB", description: "Intro...", isDeleted: false };
            const input = {
                name: "MCD",
                description: "Savoir...",
                bloomLevel: 2,
                idModule: 1,
            };
            const expectedOutput = { ...input, isDeleted: false };

            Module.findByPk.mockResolvedValue(module);
            Objective.create.mockResolvedValue(expectedOutput);

            const res = await createObjective(input);

            expect(Objective.create).toHaveBeenCalledWith(expectedOutput);
            expect(res).toEqual(expectedOutput);
        });
        it('should throw 400 if empty property', async () => {
            const input = { idModule: 1 };
            Module.findByPk.mockResolvedValue(input);

            await expect(createObjective(input)).rejects.toMatchObject({
                status: 400,
                message: "Champs obligatoires manquants"
            });
            expect(Objective.create).not.toHaveBeenCalled();
        });
    });

    describe('archiveObjective', () => {
        it('should archive the objective', async () => {
            const objective = {
                idObjective: 1,
                name: "MPD",
                description: "...",
                bloomLevel: 2,
                isDeleted: false,
                idModule: 1
            };
            const objectiveInstance = { ...objective, update: jest.fn().mockImplementation((payload) => {
                return { ...objective, ...payload };
            })};

            Objective.findByPk.mockResolvedValue(objectiveInstance);

            const res = await archiveObjective(objectiveInstance);

            expect(objectiveInstance.update).toHaveBeenCalledWith({ isDeleted: true });
            expect(res).toEqual({
                idObjective: 1,
                name: "MPD",
                description: "...",
                bloomLevel: 2,
                isDeleted: true,
                idModule: 1
            });
        });
        it('should throw 404 if objective not found', async () => {
            Objective.findByPk.mockResolvedValue(null);
            expect(archiveObjective(1)).rejects.toMatchObject({
                status: 404,
                message: "L'objectif est introuvable."
            });
        });
    });

    describe('editObjective', () => {
        it('should edit the objective', async () => {
            const objective = {
                idObjective: 1,
                name: "MPD",
                description: "...",
                bloomLevel: 2,
                isDeleted: false,
                idModule: 1,
            };
            const objectiveInstance = { ...objective, update: jest.fn().mockImplementation((payload) => {
                return { ...objective, ...payload };
            })};
            const body = {
                name: "MLD",
                otherProperty: "test"
            };

            Objective.findByPk.mockResolvedValue(objectiveInstance);

            const res = await editObjective(1, body);

            expect(Objective.findByPk).toHaveBeenCalledWith(1);
            expect(objectiveInstance.update).toHaveBeenCalledWith({
                name: "MLD",
                description: "...",
                bloomLevel: 2,
                isDeleted: false,
            });
            expect(res).toEqual({
                idObjective: 1,
                name: "MLD",
                description: "...",
                bloomLevel: 2,
                isDeleted: false,
                idModule: 1,
            });
        });
        it('should throw 404 if objective not found', async () => {
            Objective.findByPk.mockResolvedValue(null);
            expect(editObjective(1)).rejects.toMatchObject({
                status: 404,
                message: "L'objectif est introuvable."
            });
        });
        it('should throw 400 on type change', async () => {
            const objective = {
                idObjective: 1,
                name: "MPD",
                description: "...",
                bloomLevel: 2,
                isDeleted: false,
                idModule: 1,
            };
            const body = {
                name: 1,
                description: true,
                isDeleted: "maybe"
            };

            expect(editObjective(1, body)).rejects.toMatchObject({
                status: 400,
                message: "Type invalide pour les champs d'objectifs."
            });
        })
    });
});