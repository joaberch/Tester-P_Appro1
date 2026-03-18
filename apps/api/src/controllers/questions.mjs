import * as questionService from "../services/questions.mjs";
import { ValidationError } from "sequelize";

export async function getQuestionAnswers(req, res) {
    try {
        const answers = await questionService.getQuestionAnswers(req.params.id, req.user.role);
        res.status(200).json(answers);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function createQuestion(req, res) {
    try {
        const question = await questionService.createQuestion();
        res.status(201).json(question);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ message: err.message, data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveQuestion(req, res) {
    try {
        const question = await questionService.archiveQuestion(req.params.id);
        res.status(200).json(question);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function editQuestion(req, res) {
    try {
        const question = await questionService.editQuestion(req.params.id, req.body);
        res.status(200).json(question);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}