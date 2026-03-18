import * as modulesService from "../services/modules.mjs"
import { ValidationError } from "sequelize";

export async function getModules(req, res) {
    try {
        const modules = await modulesService.getModules();
        res.status(200).json(modules);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getModule(req, res) {
    try {
        const module = await modulesService.getModule(req.params.id);
        res.status(200).json(module);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function createModule(req, res) {
    try {
        const module = await modulesService.createModule(req.body);
        res.status(201).json(module);
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({ message: err.message, data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveModule(req, res) {
    try {
        const module = await modulesService.archiveModule(req.params.id);
        res.status(200).json(module);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function editModule(req, res) {
    try {
        const module = await modulesService.editModule(req.params.id, req.body);
        res.status(200).json(module);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}