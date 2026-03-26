import * as testsService from "../services/tests.mjs";

export async function getTests(req, res) {
    const userId = req.user.oid;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const test = await testsService.getTests(userId, page, pageSize);
    res.status(200).json(test);
}

export async function getTest(req, res) {
    const test = await testsService.getTest(req.params.id);
    res.status(200).json(test);
}

export async function createTest(req, res) {
    const { newTest, newCreatedBy } = await testsService.createTest(req.user.userId, req.body);
    res.status(201).json({ newTest, newCreatedBy });
}

export async function archiveTest(req, res) {
    const test = await testsService.archiveTest(req.params.id);
    res.status(200).json(test);
}

export async function editTest(req, res) {
    const { test, created_by } = await testsService.editTest(req.user.userId, req.params.id, req.body);
    res.status(200).json(test, created_by);
}

export async function assignTest(req, res) {
    const { test, assigned_to } = await testsService.assignTest(req.params.userId, req.params.testId);
    res.status(201).json(test, assigned_to);
}

export async function unassignTest(req, res) {
    const test = await testsService.unassignTest(req.params.userId, req.params.testId);
    res.status(200).json(test);
}

export async function getAssignedTest(req, res) {
    const test = await testsService.getAssignedTest(req.user.userId);
    res.status(200).json(test);
}

export async function getTestQuestions(req, res) {
    const test = await testsService.getTestQuestions(req.params.id);
    res.status(200).json(test);
}

export async function getTestAttachments(req, res) {
    const test = await testsService.getTestAttachments(req.params.id);
    res.status(200).json(test);
}