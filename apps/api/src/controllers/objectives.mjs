import * as objectivesService from "../services/objectives.mjs";

export async function getObjectivesOfModule(req, res) {
    try {
        const objectives = await objectivesService.getObjectivesOfModule(req.query.idModule);
        res.status(200).json(objectives);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function createObjective(req, res) {
    try {
        const objective = await objectivesService.createObjective(req.body);
        res.status(201).json(objective);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ message: err.message, data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveObjective(req, res) {
    try {
        const objective = await objectivesService.archiveObjective(req.params.id);
        res.status(200).json(objective);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function editObjective(req, res) {
    try {
        const objective = await objectivesService.editObjective(req.params.id, req.body);
        res.status(200).json(objective);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}