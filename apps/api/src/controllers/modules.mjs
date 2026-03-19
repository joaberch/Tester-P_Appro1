import * as modulesService from "../services/modules.mjs"

export async function getModules(req, res) {
    const modules = await modulesService.getModules();
    res.status(200).json(modules);
}

export async function getModule(req, res) {
    const module = await modulesService.getModule(req.params.id);
    res.status(200).json(module);
}

export async function createModule(req, res) {
    const module = await modulesService.createModule(req.body);
    res.status(201).json(module);
}

export async function archiveModule(req, res) {
    const module = await modulesService.archiveModule(req.params.id);
    res.status(200).json(module);
}

export async function editModule(req, res) {
    const module = await modulesService.editModule(req.params.id, req.body);
    res.status(200).json(module);
}