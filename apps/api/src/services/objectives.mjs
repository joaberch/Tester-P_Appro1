import { Module, Objective } from "../db/sequelize.mjs";

export async function getObjectivesOfModule(id) {
    const module = Module.findByPk(id);
    if (!module) {
        const error = new Error(`Aucun module ne correspond à l'identifiant rentré.`);
        error.status = 404;
        throw error;
    }

    const objectives = await Objective.findAll({
        where: {
            idModule: id,
            isDeleted: false
        }
    })
    return objectives;
}

export async function createObjective(body) {
    const payload = { ...body }

    const objective = Objective.create(payload);
    return objective;
}

export async function archiveObjective(id) {
    const archiveObjective = await Objective.findByPk(id);

    if (!archiveObjective) {
        const error = new Error(`L'objectif est introuvable.`);
        error.status = 404;
        throw error;
    }

    const objective = await archiveObjective.update({ isDeleted: true });
    return objective;
}

export async function editObjective(id, body) {
    const payload = { ...body };

    const objective = await Objective.findByPk(id);
    if (!objective) {
        const error = new Error(`L'objectif est introuvable.`);
        error.status = 404;
        throw error;
    }
    const updatedObjective = await objective.update(payload);
    return updatedObjective;
}