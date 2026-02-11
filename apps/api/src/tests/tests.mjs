import express from "express";
import { getUniqueId, getTest, removeTest, updateTest } from "../db/handler.mjs";
import { success } from "../helper.mjs";

const testsRouter = express();

//Get all tests
testsRouter.get("/", (req, res) => {
    const message = "La liste des tests a bien été récupéré.";
    res.json(success(message, tests));
});

//Get a specific test
testsRouter.get("/:id", (req, res) => {
    const testId = req.params.id;
    const test = tests.find((test) => test.id == testId);
    const message = `Le produit dont l'id vaut ${testId} a bien été récupéré.`;
    res.json(success(message, test));
});

//Create a test
testsRouter.post("/", (req, res) => {
    const id = getUniqueId(tests); //Create new id, TEMP mariadb will do it later
    const createdTest = { ...req.body, ...{ id: id, created: new Date() } };
    tests.push(createdTest); 
    
    const message = `Le produit ${createdTest.name} a bien été créé !`;
    res.json(success(message, createdTest));
});

//Delete a test
testsRouter.delete("/:id", (req, res) => {
    const testId = req.params.id;
    let deletedTest = getTest(testId);
    removeTest(testId);
    const message = `Le produit ${deletedTest.name} a bien été supprimé !`;
    res.json(success(message, deletedTest));
});

//Edit a test
testsRouter.put("/:id", (req, res) => {
    const testId = req.params.id;
    const test = getTest(testId);
    const updatedTest = {
        id: testId,
        ...req.body,
        created: test.created,
    }
    updateTest(testId, updatedTest);

    const message = `Le produit ${updateTest.name} dont l'id vaut ${testId} a bien été mis à jour.`;
    res.json(success(message, updatedTest));
})

export { testsRouter };