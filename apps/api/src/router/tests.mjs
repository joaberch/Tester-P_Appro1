import express from "express";
import { success } from "../helper.mjs";
import { Test, User, CreatedBy, AssignedTo, Question, Attachement } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/authMiddleware.mjs";
import authorizeRoles from "../auth/roleMiddleware.mjs";

const testsRouter = express();

//Get all tests
testsRouter.get("/", auth, authorizeRoles("admin", "teacher", "student"), (req, res) => { //TODO - student only the assigned test
    Test.findAll().then((tests) => {
        const message = "Tous les tests ont été récupérés.";
        res.json(success(message, tests))
    })
});

//Get a specific test
testsRouter.get("/:id", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => { //TODO - student only if assigned
    try {
        const testId = req.params.id;
        const test = await Test.findByPk(testId);
        if (!test) {
            return res.status(404).json({ message: "Ressource introuvable." })
        }

        const message = `Le test avec l'id ${test.idTest} a été récupéré.`;
        res.json(success(message, test));
    } catch (error) {
        return res.status(500).json({ message: "Le test n'a pas pu être récupéré."});
    }
});

//Get all questions
testsRouter.get("/:id/questions", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => { //TODO - student only if test assigned
    try {
        const testId = req.params.id;
        const questions = await Question.findAll({
            where: {
                idTest: testId,
            }
        });
    
        const message = `Les questions du test ${testId} ont bien été récupéré.`;
        res.json(success(message, questions));
    } catch (error) {
        res.status(500).json({ message: "Les questions du test n'ont pas pu être récupéré.", data: error.message });
    }
})

//Get all attachements
testsRouter.get("/:id/attachements", auth, authorizeRoles("admin", "teacher", "student"), async (req, res) => { //TODO - student only if test assigned
    try {
        const testId = req.params.id;
        const attachements = await Attachement.findAll({
            where: {
                idTest: testId,
            }
        })

        const message = `Les pièces jointes du test ${testId} ont bien été récupéré.`;
        res.json(success(message, attachements));
    } catch (error) {
        res.status(500).json({ message: "Les pièces jointes n'ont pas pu être récupéré.", data: error.message});
    }
});

//Create a test
testsRouter.post("/", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const { creatorId, ...testData } = req.body;
        if (!creatorId || !creatorId.length === 0) {
            return res.status(400).json({ message: "Le test n'a pas de créateur." });
        }

        //Get creator information and check role
        const teacher = await User.findAll({
            where: {
                idUser: creatorId,
                role: ["teacher", "admin"],
                isDeleted: false,
            }
        });
        if (teacher.length == 0) {
            return res.status(400).json({ message: "L'utilisateur ayant créé le test n'est pas un enseignant ou un administrateur." });
        }

        //Create test
        const newTest = await Test.create(testData)
        const testMessage = `Le test ${newTest.name} a été créé`;

        //Create created_by
        const created_by = { "idUser": creatorId, "idTest": newTest.idTest } //TODO - warning
        const newCreatedBy = await CreatedBy.create(created_by)
        const createdByMessage = `Le lien de création entre l'utilisateur ${newCreatedBy.idUser} et le test ${newCreatedBy.idTest} a bien été créé.`;
        res.json(success(testMessage + "\n" + createdByMessage, newTest + newCreatedBy));
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: "Le test n'a pas pu être créé.", data: error.message });
    }
});

//Archivate a test
testsRouter.put("/archivate/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
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
testsRouter.delete("/:id", auth, authorizeRoles("admin"), (req, res) => {
    Test.findByPk(req.params.id).then((deletedTest) => {
        Test.destroy({
            where: { idTest: deletedTest.idTest },
        }).then((_) => {
            const message = `Le test ${deletedTest.name} a été supprimé.`;
            res.json(success(message, deletedTest))
        }).catch((error) => {
            if (error.name == "SequelizeForeignKeyConstraintError") {
                return res.status(400).json({ message: "Impossible de supprimer ce test car il est encore lié à d'autres tables.", data: error });
            }
            const message = "Le test n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
            res.status(500).json({ message, data: error })
        })
    })
});

//Edit a test
testsRouter.put("/:id", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const { creatorId, ...testData } = req.body;
        const testId = req.params.id;

        //get test
        const test = await Test.findByPk(testId);
        if (!test) {
            return res.status(404).json({ message: "Test non trouvé." });
        }

        
        //update test
        const updatedTest = await test.update(testData);
        const testMessage = `Le test ${updatedTest.name} avec l'id ${updatedTest.idTest} a été mis à jour.`;
        console.log(updatedTest)
        
        const alreadyExist = await CreatedBy.findOne({ where: { idTest: testId, idUser: creatorId } });

        //get creator data
        if (!alreadyExist) {
            const teacher = await User.findAll({
                where: {
                    idUser: creatorId,
                    role: ["teacher", "admin"],
                    isDeleted: false,
                }
            });
            if (teacher.length == 0) {
                return res.status(400).json({ message: "L'utilisateur ayant créé le test n'est pas un enseignant ou un administrateur." });
            }
            
            const created_by = { "idUser": creatorId, "idTest": test.idTest } //TODO - check if teacher duplicate make a panic or still works
            const newCreatedBy = await CreatedBy.create(created_by);
            const createdByMessage = `Le lien de création entre l'utilisateur ${newCreatedBy.idUser} et le test ${newCreatedBy.idTest} a bien été créé.`;
            return res.json(success(testMessage + "\n" + createdByMessage, test + newCreatedBy));
        }
        return res.json(success(testMessage, test))
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: "Le test n'a pas pu être créé.", data: error.message });
    }
});

//Assign a test
testsRouter.post("/:testId/user/:userId", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const testId = req.params.testId;
        const userId = req.params.userId;
        const alreadyExist = await AssignedTo.findOne({ where: { idTest: testId, idUser: userId } });
        if (alreadyExist) {
            return res.status(400).json({ message: "Ce test est déjà assigné à cet utilisateur." })
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `L'utilisateur avec l'id ${userId} n'a pas été trouvé.` })
        }
        const test = await Test.findByPk(testId);
        if (!test) {
            return res.status(404).json({ message: `Le test avec l'id ${testId} n'a pas été trouvé.` })
        }
        const createAssignedTo = {
            "idUser": userId,
            "idTest": testId,
        }
        const createdAssignedTo = AssignedTo.create(createAssignedTo);
        const message = `L'assignation du test ${testId} à l'utilisateur ${userId} a réussi`;
        res.json(success(message, createdAssignedTo));
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        if (error instanceof SequelizeUniqueConstraintError) {
            return res.status(400).json({ message: "L'utilisateur a déjà été assigné à ce test" })
        }
        res.status(500).json({ message: "L'assignation n'a pas pu être créé.", data: error.message });
    }
});

//De-Assign a test
testsRouter.delete("/:testId/user/:userId", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const testId = req.params.testId;
        const userId = req.params.userId;
        const assignation = await AssignedTo.findOne({ where: { idTest: testId, idUser: userId } });
        if (!assignation) {
            return res.status(400).json({ message: "L'assignation n'existe pas et ne peut donc pas être supprimé." })
        }

        const removedAssignedTo = await assignation.destroy();
        const message = `Le test ${testId} n'est plus assigné à l'utilisateur ${userId}.`;
        res.json(success(message, removedAssignedTo));
    } catch (error) {
        const message = "L'assignation n'a pas pu être supprimé. Veuillez réessayer dans un moment.";
        res.status(500).json({ message, data: error });
    }
});

//Get tests done TODO

export { testsRouter };