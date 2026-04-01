import { Module } from "../db/sequelize.mjs";

export async function getModules() {
    const modules = await Module.findAll({
        where: {
            isDeleted: false,
        }
    })
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
    const payload = {
        name: body.name,
        description: body.description,
        isDeleted: false,
    }

    const module = await Module.create(payload);
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

    if ((body.name != undefined && typeof body.name != "string") ||
    (body.description != undefined && typeof body.description != "string") ||
    (body.isDeleted != undefined && typeof body.isDeleted != "boolean")) {
        const error = new Error(`Invalid type for module fields.`);
        error.status = 400;
        throw error;
    }

    const payload = {
        name: body.name ?? module.name,
        description: body.description ?? module.description,
        isDeleted: body.isDeleted ?? module.isDeleted,
    };
    const updatedModule = await module.update(payload);
    return updatedModule;
}