import { Module } from "../db/sequelize.mjs";

export async function getModules() {
    const modules = await Module.findAll()
    return modules
}

export async function getModule(id) {
    const module = await Module.findByPk(id);
    if (!module) {
        const error = new Error(`Le module est introuvable.`);
        error.status = 404;
        throw error;
    }

    return module;
}

export async function createModule(body) {
    const payload = { ...body }

    const module = Module.create(payload);
    return module;
}

export async function archiveModule(id) {
    const archiveModule = await Module.findByPk(id);

    if (!archiveModule) {
        const error = new Error(`Module introuvable.`);
        error.status = 404;
        throw error;
    }

    const module = await archiveModule.update({ isDeleted: true });
    return module;
}

export async function editModule(id, body) {
    const module = await Module.findByPk(id);
    if (!module) {
        const error = new Error(`Module introuvable.`);
        error.status = 404;
        throw error;
    }

    const payload = { ...body };
    const updatedModule = await module.update(payload);
    return updatedModule;
}