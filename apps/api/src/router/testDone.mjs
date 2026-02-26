import express from "express";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";
import { TestDone } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { success } from "../helper.mjs";

const testDoneRouter = express();

//Create a test result
testDoneRouter.post("/", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => {
    try {
        const createdTestDone = await TestDone.create(req.body);
        const message = `Le test ${createdTestDone.idTestDone} a été fait et créé.`;
        res.json(success(message, createdTestDone));
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "Le test complété n'a pas été ajouté.";
        res.status(500).json({ message, data: error.message });
    }
});

export { testDoneRouter };