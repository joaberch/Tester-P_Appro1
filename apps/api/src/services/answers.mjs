import { Answer, Question } from "../db/sequelize.mjs";

export async function createAnswer(data) {
    const question = await Question.findByPk(data.idQuestion);
    if (!question) {
        const error = new Error(`La question n'existe pas.`);
        error.status = 404;
        throw error;
    }

    const answer = await Answer.create(data);
    return answer;
}

export async function archiveAnswer(id) {
    const archiveAnswer = await Answer.findByPk(id);

    if (!archiveAnswer) {
        const error = new Error(`La réponse n'a pas été trouvé.`);
        error.status = 404;
        throw error;
    }

    const answer = await archiveAnswer.update({ isDeleted: true });
    return answer;
}

export async function editAnswer(id, body) {
    const answerToUpdate = await Answer.findByPk(id);
    if (!answerToUpdate) {
        const error = new Error(`La réponse n'a pas été trouvé`);
        error.status = 404;
        throw error;
    }

    const answer = await answerToUpdate.update(body);
    return answer;
}