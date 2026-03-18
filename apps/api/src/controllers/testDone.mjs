import * as testsDoneService from "../services/testDone.mjs";

export async function createTestResult(req, res) {
    try {
        const test = await testsDoneService.createTestResult(req.user.userId, req.body);
        res.status(201).json(test);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ message: err.message, data: err });
        }
        res.status(err.status || 500).json({ message: err.message });
    }
}