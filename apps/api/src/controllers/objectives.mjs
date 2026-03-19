import * as objectivesService from "../services/objectives.mjs";

export async function getObjectivesOfModule(req, res) {
    const objectives = await objectivesService.getObjectivesOfModule(req.query.idModule);
    res.status(200).json(objectives);
}

export async function createObjective(req, res) {
    const objective = await objectivesService.createObjective(req.body);
    res.status(201).json(objective);
}

export async function archiveObjective(req, res) {
    const objective = await objectivesService.archiveObjective(req.params.id);
    res.status(200).json(objective);
}

export async function editObjective(req, res) {
    const objective = await objectivesService.editObjective(req.params.id, req.body);
    res.status(200).json(objective);
}