import * as questionService from "../services/questions.mjs";

export async function getQuestionAnswers(req, res) {
    const answers = await questionService.getQuestionAnswers(req.params.id, req.user.role);
    res.status(200).json(answers);
}

export async function createQuestion(req, res) {
    const question = await questionService.createQuestion();
    res.status(201).json(question);
}

export async function archiveQuestion(req, res) {
    const question = await questionService.archiveQuestion(req.params.id);
    res.status(200).json(question);
}

export async function editQuestion(req, res) {
    const question = await questionService.editQuestion(req.params.id, req.body);
    res.status(200).json(question);
}