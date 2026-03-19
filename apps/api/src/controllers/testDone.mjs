import * as testsDoneService from "../services/testDone.mjs";

export async function createTestResult(req, res) {
    const test = await testsDoneService.createTestResult(req.user.userId, req.body);
    res.status(201).json(test);
}