import { Module, Objective } from "../db/sequelize.mjs";

export async function getObjectivesOfModule(id) {
    const module = await Module.findByPk(id);
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
    if (!body.name || !body.idModule) {
        const error = new Error("Champs obligatoires manquants");
        error.status = 400;
        throw error;
    }

    const module = await Module.findByPk(body.idModule);
    if (!module) {
        const error = new Error(`L'objectif n'est pas rattaché à un module valable.`);
        error.status = 404;
        throw error;
    }

    const payload = {
        name: body.name,
        description: body.description,
        bloomLevel: body.bloomLevel,
        isDeleted: false,
        idModule: body.idModule,
    }

    const objective = await Objective.create(payload);
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
    if ((body.name && typeof body.name != "string") ||
    (body.description && typeof body.description != "string") ||
    (body.bloomLevel && typeof body.bloomLevel != "integer") ||
    (body.isDeleted && typeof body.isDeleted != "boolean")
    ) {
        const error = new Error(`Type invalide pour les champs d'objectifs.`);
        error.status = 400;
        throw error;
    }

    const objective = await Objective.findByPk(id);
    if (!objective) {
        const error = new Error(`L'objectif est introuvable.`);
        error.status = 404;
        throw error;
    }

    const payload = {
        name: body.name ?? objective.name,
        description: body.description ?? objective.description,
        bloomLevel: body.bloomLevel ?? objective.bloomLevel,
        isDeleted: body.isDeleted ?? objective.isDeleted,
    };

    const updatedObjective = await objective.update(payload);
    return updatedObjective;
}