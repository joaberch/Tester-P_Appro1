import { ValidationError } from "sequelize";
import * as testsService from "../services/tests.mjs";

export async function getTests(req, res) {
    try {
        const test = await testsService.getTests(req.user.userId);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getTest(req, res) {
    try {
        const test = await testsService.getTest(req.params.id);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function createTest(req, res) {
    try {
        const { test, created_by } = await testsService.createTest(req.user.userId, req.body);
        res.status(201).json(test, created_by);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ message: err.message, data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function archiveTest(req, res) {
    try {
        const test = await testsService.archiveTest(req.params.id);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function editTest(req, res) {
    try {
        const { test, created_by } = await testsService.editTest(req.user.userId, req.params.id, req.body);
        res.status(200).json(test, created_by);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ message: err.message, data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function assignTest(req, res) {
    try {
        const { test, assigned_to } = await testsService.assignTest(req.params.userId, req.params.testId);
        res.status(201).json(test, assigned_to);
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({ message: err.message, data: err });
        }
        if (err instanceof SequelizeUniqueConstraintError) {
            res.status(400).json({ message: "L'utilisateur a déjà été assigné à ce test" })
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function unassignTest(req, res) {
    try {
        const test = await testsService.unassignTest(req.params.userId, req.params.testId);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getAssignedTest(req, res) {
    try {
        const test = await testsService.getAssignedTest(req.user.userId);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getTestQuestions(req, res) {
    try {
        const test = await testsService.getTestQuestions(req.params.id);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getTestAttachments(req, res) {
    try {
        const test = await testsService.getTestAttachments(req.params.id);
        res.status(200).json(test);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}