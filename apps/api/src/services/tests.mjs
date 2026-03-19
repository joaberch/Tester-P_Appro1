import { AssignedTo, Attachment as Attachment, CreatedBy, Question, Test, User } from "../db/sequelize.mjs";

export async function getTests() {
    const tests = Test.findAll();
    return tests;
}

export async function getTest(id) { //TODO students only if assigned
    const test = await Test.findByPk(id);
    if (!test) {
        console.log(id)
        const error = new Error(`Le test est introuvable.`);
        error.status = 404;
        throw error;
    }
    return test
}

export async function createTest(creatorId, body) {
    if (!creatorId) {
        const error = new Error(`Le créateur n'a pas pu être trouvé.`);
        error.status = 404;
        throw error;
    }

    const payload = {
        creatorId: creatorId,
        ...body
    }

    //Create test
    const newTest = await Test.create(payload)

    //Create created_by
    const created_by = {
        "idUser": creatorId,
        "idTest": newTest.idTest
    } //TODO - warning
    const newCreatedBy = await CreatedBy.create(created_by)

    return { newTest, newCreatedBy };
}

export async function archiveTest(id) {
    const archiveTest = await Test.findByPk(id);

    if (!archiveTest) {
        const error = new Error(`Test introuvable.`);
        error.status = 404;
        throw error;
    }

    const test = await archiveTest.update({ isDeleted: true });
    return test;
}

export async function editTest(creatorId, testId, body) {
    //get test
    const test = await Test.findByPk(testId);
    if (!test) {
        const error = new Error(`Test introuvable.`);
        error.status = 404;
        throw error;
    }

    //update test
    const payload = { ...body }
    const updatedTest = await test.update(payload);
    let newCreatedBy;

    const alreadyExist = await CreatedBy.findOne({ where: { idTest: testId, idUser: creatorId } });

    //add creator
    if (!alreadyExist) {
        const created_by = {
            "idUser": creatorId,
            "idTest": test.idTest
        }
        newCreatedBy = await CreatedBy.create(created_by);
    }
    return { updatedTest, newCreatedBy };
}

export async function assignTest(userId, testId) {
    const user = await User.findByPk(userId); //Check user exist
    if (!user) {
        const error = new Error(`L'utilisateur avec l'id ${userId} n'a pas été trouvé.`);
        error.status = 404;
        throw error;
    }

    const test = await Test.findByPk(testId); //Check test exist
    if (!test) {
        const error = new Error(`Le test avec l'id ${testId} n'a pas été trouvé.`);
        error.status = 404;
        throw error;
    }

    const alreadyExist = await AssignedTo.findOne({ where: { idTest: testId, idUser: userId } }); //Check user isn't already assigned to this test
    if (alreadyExist) {
        const error = new Error(`Ce test est déjà assigné à cet utilisateur.`);
        error.status = 400;
        throw error;
    }

    const createAssignedTo = { //Assign
        "idUser": userId,
        "idTest": testId,
    }
    const assignedTo = await AssignedTo.create(createAssignedTo);
    return assignedTo;
}

export async function unassignTest(userId, testId) {
    const user = await User.findByPk(userId); //Check user exist
    if (!user) {
        const error = new Error(`L'utilisateur avec l'id ${userId} n'a pas été trouvé.`);
        error.status = 404;
        throw error;
    }

    const test = await Test.findByPk(testId); //Check test exist
    if (!test) {
        const error = new Error(`Le test avec l'id ${testId} n'a pas été trouvé.`);
        error.status = 404;
        throw error;
    }

    const exist = await AssignedTo.findOne({ where: { idTest: testId, idUser: userId } }); //Check user isn't already assigned to this test
    if (!exist) {
        const error = new Error(`Ce test n'est pas assigné à cet utilisateur.`);
        error.status = 400;
        throw error;
    }

    const removeAssignedTo = await exist.destroy();
    return removeAssignedTo;
}

export async function getAssignedTest(idUser) {
    const user = await User.findByPk(idUser, {
        include: [
            {
                model: Test,
                as: "assigned_by",
                through: { attributes: [] },
            },
        ],
    });
    return user.assigned_by;
}

export async function getTestQuestions(testId) {
    const test = await Test.findByPk(testId);
    if (!test) {
        const error = new Error(`Le test est introuvable.`);
        error.status = 404;
        throw error;
    }

    const questions = await Question.findAll({
        where: {
            idTest: test.idTest,
            isDeleted: false,
        }
    });
    return questions;
}

export async function getTestAttachments(testId) {
    const test = await Test.findByPk(testId);
    if (!test) {
        const error = new Error(`Le test est introuvable.`);
        error.status = 404;
        throw error;
    }

    const attachments = await Attachment.findAll({
        where: {
            idTest: test.idTest,
        }
    });
    return attachments;
}