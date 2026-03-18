import * as answersService from "../services/answers.mjs";

export async function createAnswer(req, res) {
    try {
        const answer = await answersService.createAnswer(req.body);
        res.status(201).json(answer);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveAnswer(req, res) {
    try {
        const answer = await answersService.archiveAnswer(req.params.id);
        res.status(200).json(answer);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function editAnswer(req, res) {
    try {
        const answer = await answersService.editAnswer(req.params.id, req.body);
        res.status(200).json(answer);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}