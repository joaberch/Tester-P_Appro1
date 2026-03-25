import { Sequelize } from "sequelize";
import { AssignedTo, Attachment as Attachment, CreatedBy, Question, Test, User } from "../db/sequelize.mjs";

export async function getTests(userId, page=1, pageSize=20) {
    if (!userId) {
        throw new Error(`userid is required`)
    }

    const offset = (page-1)*pageSize;

    const tests = await Test.findAndCountAll({
        subQuery: false,
        include: [
            {
                model: User,
                association: 'createdTest',
                attributes: [],
                through: { attributes: [] },
                where: { idUser: userId },
                required: false
            }
        ],
        attributes: {
            include: [
                [
                    Sequelize.literal(`createdTest.idUser IS NOT NULL`),
                    'isMine'
                ]
            ]
        },
        order: [ //1. User test - 2. Other test 3. Archived test - 4. On alphabetical order from name
            [
                'isDeleted',
                'ASC'
            ],
            [
                Sequelize.literal(`createdTest.idUser IS NOT NULL`),
                'DESC'
            ],
            [
                'name',
                'ASC'
            ]
        ],
        limit: pageSize,
        offset: offset,
        distinct: true,
    });
    return {
        data: tests.rows,
        total: tests.count,
        page,
        pageSize,
        totalPages: Math.ceil(tests.count / pageSize)
    }
}

export async function getTest(id) { //TODO students only if assigned
    const test = await Test.findByPk(id);
    if (!test) {
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
        name: body.name,
        description: body.description,
        duration: body.duration,
        isDeleted: false,
        isFormative: body.isFormative,
        createdAt: body.createdAt,
        idModule: body.idModule,
    }

    //Create test
    const newTest = await Test.create(payload);

    //Create created_by
    const created_by = {
        idUser: creatorId,
        idTest: newTest.idTest,
    }
    const newCreatedBy = await CreatedBy.create(created_by);

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
    const payload = {
        name: body.name,
        description: body.description,
        duration: body.duration,
        isDeleted: body.isDeleted,
        isFormative: body.isFormative,
    }
    const updatedTest = await test.update(payload);
    let newCreatedBy;

    const alreadyExist = await CreatedBy.findOne({ where: { idTest: testId, idUser: creatorId } });

    //add creator
    if (!alreadyExist) {
        const created_by = {
            idUser: creatorId,
            idTest: test.idTest
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
        where: {
            isDeleted: false,
        }
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
            isDeleted: false,
        }
    });
    return attachments;
}