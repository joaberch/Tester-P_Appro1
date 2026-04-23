import * as objectivesService from "../services/objectives.mjs";


export const ObjectiveController = {
    get : async (req, res) =>{
        const objectives = await objectivesService.getObjectivesOfModule(req.query.idModule);
        res.status(200).json(objectives);
    },

    create : async(req, res) =>{
        const objective = await objectivesService.createObjective(req.body);
        res.status(201).json(objective);
    },

    archive : async(req, res) =>{
        const objective = await objectivesService.archiveObjective(req.params.id);
        res.status(200).json(objective);
    },

    edit : async(req, res) =>{
        const objective = await objectivesService.editObjective(req.params.id, req.body);
        res.status(200).json(objective);
    }
}