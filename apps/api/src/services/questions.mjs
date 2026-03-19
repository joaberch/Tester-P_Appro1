import { Answer, Question } from "../db/sequelize.mjs";

export async function getQuestionAnswers(id, role) {
    const question = Question.findByPk(id);
    if (!question) {
        const error = new Error(`La question est introuvable.`);
        error.status = 404;
        throw error;
    }

    let answers;

    if (role == "student") {
        answers = await Answer.findAll({
            where: {
                idQuestion: id,
                isDeleted: false,
            },
            attributes: {
                exclude: ["isCorrect"]
            }
        });
    } else {
        answers = await Answer.findAll({
            where: {
                idQuestion: id,
                isDeleted: false
            }
        });
    }

    return answers;
}

export async function createQuestion(body) {
    const payload = { ...body };

    const question = Question.create(payload);
    return question;
}

export async function archiveQuestion(id) {
    const archiveQuestion = await Question.findByPk(id);

    if (!archiveQuestion) {
        const error = new Error(`La question est introuvable.`);
        error.status = 404;
        throw error;
    }

    const question = await archiveQuestion.update({ isDeleted: true });
    return question;
}

export async function editQuestion(id, body) {
    const question = await Question.findByPk(id);
    if (!question) {
        const error = new Error(`La question est introuvable.`);
        error.status = 404;
        throw error;
    }
    
    const payload = { ...body };
    const updatedQuestion = await question.update(payload);
    return updatedQuestion;
}