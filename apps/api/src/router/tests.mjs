import express from "express";
import { success } from "../helper.mjs";
import { Test } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";

const testsRouter = express();

//Get all tests
testsRouter.get("/", (req, res) => {
    Test.findAll().then((tests) => {
        const message = "Tous les tests ont été récupérés.";
        res.json(success(message, tests))
    })
});

//Get a specific test
testsRouter.get("/:id", (req, res) => {
    Test.findByPk(req.params.id).then((test) => {
        const message = `Le test avec l'id ${test.id} a été récupéré.`;
        res.json(success(message, test));
    })
});

//Create a test
testsRouter.post("/", (req, res) => {
    Test.create(req.body).then((createdTest) => {
        const message = `Le test ${createdTest.name} a été créé.`;
        res.json(success(message, createdTest));
    }).catch((error) => {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        const message = "Le test n'a pas été ajouté. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    })
});

//Delete a test
testsRouter.delete("/:id", (req, res) => {
    Test.findByPk(req.params.id).then((deletedTest) => {
        Test.destroy({
            where: { id: deletedTest.id },
        }).then((_) => {
            const message = `Le test ${deletedTest.name} a été supprimé.`;
            res.json(success(message, deletedTest))
        })
    })
});

//Edit a test
testsRouter.put("/:id", (req, res) => {
    const testId = req.params.id;
    Test.update(req.body, { where: { id: testId } }).then((_) => {
        Test.findByPk(testId).then((updatedTest) => {
            const message = `Le test ${updatedTest.name} avec l'id ${updatedTest.id} a été mis à jour.`;
            res.json(success(message, updatedTest));
        })
    })
})

export { testsRouter };