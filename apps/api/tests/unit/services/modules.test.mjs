import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule('../../../src/db/sequelize.mjs', () => ({
    Module: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
}));

const { Module } = await import("../../../src/db/sequelize.mjs");
const { getModules, getModule, createModule, archiveModule, editModule } = await import("../../../src/services/modules.mjs");

const makeModuleMock = (data) => {
    let save = { ...data };
    return {
        ...save,
        update: jest.fn().mockImplementation((payload) => {
            save = { ...save, ...payload } //merge to get all info
            return { ...save };
        })
    }
};

describe('Modules Service', () => {
    describe('getModules', () => {
        it('should get the modules not archived', async () => {
            const modules = [
                { idModule: "1", name: "Base de données", description: "Introduction aux bases de données relationnelles.", isDeleted: false },
                { idModule: "2", name: "Programmation Java", description: "Bases de la programmation orientée objet en Java", isDeleted: true },
            ];
            Module.findAll.mockResolvedValue(modules.filter(module => !module.isDeleted));

            const result = await getModules();
            
            expect(result).toEqual([modules[0]]);
        });
        it('should be null if no modules exists', async () => {
            Module.findAll.mockResolvedValue(null);
            const res = await getModules();
            expect(res).toEqual(null);
        });
    });

    describe('getModule', () => {
        it('should get the module', async () => {
            const modules = [
                { idModule: "1", name: "Base de données", description: "Introduction aux bases de données relationnelles.", isDeleted: false },
                { idModule: "2", name: "Programmation Java", description: "Bases de la programmation orientée objet en Java", isDeleted: true },
            ];
            Module.findByPk.mockImplementation((id) => {
                return Promise.resolve(modules.find(module => module.idModule == id));
            });

            const res = await getModule(1);

            expect(res).toEqual(modules[0]);
            expect(Module.findByPk).toHaveBeenCalledWith(1);
        });
        it('should throw 404 if module not found', async () => {
            Module.findByPk.mockResolvedValue(null);
            await expect(getModule(1)).rejects.toMatchObject({ status: 404 });
        });
    });

    describe('createModule', () => {
        it('should create the module', async () => {
            const input = { name: "Base de données", description: "Introduction aux bases de données relationnelles." }
            const module = { ...input, isDeleted: false };
            Module.create.mockResolvedValue(module);

            const res = await createModule(input);

            expect(res).toEqual(module);
            expect(Module.create).toHaveBeenCalledWith({ name: input.name, description: input.description, isDeleted: false })
        });
        it('should create the module even with missing arguments', async () => { //name and description are not mandatory
            const input = {};
            const createdModule = { name: undefined, description: undefined, isDeleted: false };
            Module.create.mockResolvedValue(createdModule);

            const res = await createModule(input);

            expect(Module.create).toHaveBeenCalledWith({ name: undefined, description: undefined, isDeleted: false });
            expect(res).toEqual(createdModule);
        });
    });

    describe('archiveModule', () => {
        it('should archive the module', async () => {
            const module = {
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: false,
            }
            const moduleInstance = makeModuleMock(module);

            Module.findByPk.mockResolvedValue(moduleInstance);

            const result = await archiveModule(1);

            expect(moduleInstance.update).toHaveBeenCalledWith({ isDeleted: true });
            expect(result).toEqual({
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            });
        });
        it('should throw 404 if module not found', async () => {
            Module.findByPk.mockResolvedValue(null);
            await expect(archiveModule(1)).rejects.toMatchObject({ status: 404 });
        })
        it('should change nothing if module is already archived', async () => {
            const module = {
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            }
            const moduleInstance = makeModuleMock(module);

            Module.findByPk.mockResolvedValue(moduleInstance);

            const result = await archiveModule(1);

            expect(moduleInstance.update).toHaveBeenCalledWith({ isDeleted: true });
            expect(result).toEqual({
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            });
        })
    });

    describe('editModule', () => {
        it('should edit the module', async () => {
            const module = {
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            }
            const moduleInstance = makeModuleMock(module);
            const body = {
                name: "DB",
                description: "Intro...",
                isDeleted: false,
            }

            Module.findByPk.mockResolvedValue(moduleInstance);

            const res = await editModule(1, body);

            expect(res).toEqual({ idModule: "1", ...body });
            expect(moduleInstance.update).toHaveBeenCalledWith(body);
        });
        it('should throw 404 if module not found', async () => {
            Module.findByPk.mockResolvedValue(null);
            await expect(editModule(1, {})).rejects.toMatchObject({ status: 404 });
        });
        it('should throw on missing/adding other fields', async () => {
            const module = {
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            }
            const moduleInstance = makeModuleMock(module);
            const body = {
                name: "DB",
                isDeleted: false,
                otherField: "hey"
            }

            Module.findByPk.mockResolvedValue(moduleInstance);

            const res = await editModule(1, body);

            expect(res).toEqual({ idModule: "1", name: "DB", isDeleted: false, description: "Introduction au ..." });
            expect(moduleInstance.update).toHaveBeenCalledWith({ name: "DB", isDeleted: false, description: "Introduction au ..." });
        });
        it('shouldn\'t edit on empty body', async () => {
            const module = {
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            }
            const moduleInstance = makeModuleMock(module);
            const body = {};

            Module.findByPk.mockResolvedValue(moduleInstance);

            const res = await editModule(1, body);

            expect(res).toEqual(module);
            expect(moduleInstance.update).toHaveBeenCalledWith({ name: "Base de données", description: "Introduction au ...", isDeleted: true });
        });
        it('should throw 400 on type change', async () => {
            const module = {
                idModule: "1",
                name: "Base de données",
                description: "Introduction au ...",
                isDeleted: true,
            }
            const moduleInstance = makeModuleMock(module);
            const body = {
                name: true,
                description: 1,
                isDeleted: "maybe",
            };

            Module.findByPk.mockResolvedValue(moduleInstance);

            await expect(editModule(1, body)).rejects.toMatchObject({ status: 400 });
        });
    })
})