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
        const message = `Le test avec l'id ${test.idTest} a été récupéré.`;
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

//Archivate a test
testsRouter.put("/archivate/:id", async (req, res) => {
    const testId = req.params.id;
    let archivateTest = await Test.findByPk(testId);

    if (!archivateTest) {
        return res.status(404).json({ message: "Test non trouvé" });
    }

    await archivateTest.update({ isDeleted: true }).then((_) => {
        const message = `Le test ${archivateTest.name} a bien été supprimé (archivé).`;
        res.json(success(message, archivateTest));
    });
});

//Delete a test
testsRouter.delete("/:id", (req, res) => {
    Test.findByPk(req.params.id).then((deletedTest) => {
        Test.destroy({
            where: { idTest: deletedTest.idTest },
        }).then((_) => {
            const message = `Le test ${deletedTest.name} a été supprimé.`;
            res.json(success(message, deletedTest))
        }).catch((error) => {
            if (error.name == "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({message: "Impossible de supprimer ce test car il est encore lié à d'autres tables.", data: error});
            }
            const message = "Le test n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
            res.status(500).json({ message, data: error})
        })
    })
});

//Edit a test
testsRouter.put("/:id", (req, res) => {
    const testId = req.params.id;
    Test.update(req.body, { where: { idTest: testId } }).then((_) => {
        Test.findByPk(testId).then((updatedTest) => {
            const message = `Le test ${updatedTest.name} avec l'id ${updatedTest.idTest} a été mis à jour.`;
            res.json(success(message, updatedTest));
        });
    });
});

export { testsRouter };