import { TestDone } from "../db/sequelize.mjs";

export async function createTestResult(id, body) {
        if (!id) {
            const error = new Error(`Erreur lors de la récupération de l'utilisateur.`);
            error.status = 500;
            throw error;
        }

        const payload = {
            score: body.score,
            idTest: body.idTest,
            idUser: body.idUser,
        }

        const testDone = await TestDone.create(payload);
        return testDone;
}