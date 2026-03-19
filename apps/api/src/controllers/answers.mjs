import * as answersService from "../services/answers.mjs";

export async function createAnswer(req, res) {
    const answer = await answersService.createAnswer(req.body);
    res.status(201).json(answer);
}

export async function archiveAnswer(req, res) {
    const answer = await answersService.archiveAnswer(req.params.id);
    res.status(200).json(answer);
}

export async function editAnswer(req, res) {
    const answer = await answersService.editAnswer(req.params.id, req.body);
    res.status(200).json(answer);
}