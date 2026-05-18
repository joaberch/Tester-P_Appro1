import request from "supertest";
import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";

//mock authentication middleware to bypass them
jest.unstable_mockModule('../../src/middlewares/auth.mjs', () => ({
    default: (req, res, next) => next()
}));
jest.unstable_mockModule('../../src/middlewares/role.mjs', () => ({
    default: () => (req, res, next) => next()
}));

const app = (await import('../../src/app.mjs')).default;
const { sequelize, Question, Answer, Test, Module } = await import('../../src/db/sequelize.mjs');

describe("Answers integration", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await Module.create({ idModule: 1, name: "module", description: "description" });
        await Test.create({ idTest: 1, name: "test", description: "description", duration: 60, isFormative: false, idModule: 1 });
        await Question.create({ idQuestion: 1, question: "Une question", point: 1, type: "checkbox", idTest: 1 });
    });
    afterAll(async () => {
        await sequelize.close();
    });

    //Création
    it("POST /answers -> should create an answer", async () => {
        const body = {
            idQuestion: 1,
            answer: "My answer",
            isCorrect: false,
            isDeleted: false
        }
        const res = await request(app)
            .post("/api/answers")
            .send(body);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("idAnswer");

        // Vérif DB réelle
        const answerInDb = await Answer.findByPk(res.body.idAnswer);
        expect(answerInDb).not.toBeNull();
    });

    it("POST /answers -> should return 404 if question does not exist", async () => {
        const res = await request(app)
            .post("/api/answers")
            .send({ idQuestion: 999 });

        expect(res.status).toBe(404);
    });

    //Modification
    it("PUT /answers/:id -> should update an answer", async () => {
        const created = await Answer.create({
            idQuestion: 1,
            answer: "old",
            isCorrect: false,
            isDeleted: false
        });

        const res = await request(app)
            .put(`/api/answers/${created.idAnswer}`)
            .send({
                answer: "new value",
                isCorrect: true
            });

        expect(res.status).toBe(200);
        expect(res.body.answer).toBe("new value");
        expect(res.body.isCorrect).toBe(true);
    });

    it("PUT /answers/:id -> should return 404 if answer not found", async () => {
        const res = await request(app)
            .put("/api/answers/999")
            .send({ answer: "test" });

        expect(res.status).toBe(404);
    });

    //Archive
    it("PUT /answers/archive/:id -> should archive answer", async () => {
        const created = await Answer.create({
            idQuestion: 1,
            answer: "to archive",
            isCorrect: false,
            isDeleted: false
        });

        const res = await request(app)
            .put(`/api/answers/archive/${created.idAnswer}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.isDeleted).toBe(true);

        const dbAnswer = await Answer.findByPk(created.idAnswer);
        expect(dbAnswer.isDeleted).toBe(true);
    });

    it("PUT /answers/archive/:id -> should return 404 if answer not found", async () => {
        const res = await request(app)
            .put("/api/answers/archive/999");

        expect(res.status).toBe(404);
    });
})