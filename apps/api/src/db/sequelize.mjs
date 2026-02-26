import { DataTypes, Sequelize } from "sequelize";
import dotenv from "dotenv";
import { AnswerModel } from "../models/answers.mjs";
import { AttachementModel } from "../models/attachements.mjs";
import { ModuleModel } from "../models/modules.mjs";
import { ObjectiveModel } from "../models/objectives.mjs";
import { QuestionModel } from "../models/questions.mjs";
import { TestModel } from "../models/tests.mjs";
import { UserModel } from "../models/users.mjs";
import { AssignedToModel } from "../models/assigned_to.mjs";
import { CreatedByModel } from "../models/created_by.mjs";
import { TestDoneModel } from '../models/testDone.mjs';
import { AnswerDoneModel } from "../models/answerDone.mjs";
import { AnswerChosenModel } from '../models/answers_chosen.mjs';
dotenv.config()

const DB_NAME = process.env.DB_NAME;
const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;

const sequelize = new Sequelize(
    DB_NAME,
    USERNAME,
    PASSWORD,
    {
        host: HOST,
        port: PORT,
        dialect: "mariadb",
        logging: false,
    }
)

const Answer = AnswerModel(sequelize, DataTypes);
const Attachement = AttachementModel(sequelize, DataTypes);
const Module = ModuleModel(sequelize, DataTypes);
const Objective = ObjectiveModel(sequelize, DataTypes);
const Question = QuestionModel(sequelize, DataTypes);
const Test = TestModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const AssignedTo = AssignedToModel(sequelize, DataTypes);
const CreatedBy = CreatedByModel(sequelize, DataTypes);
const TestDone = TestDoneModel(sequelize, DataTypes);
const AnswerDone = AnswerDoneModel(sequelize, DataTypes);
const AnswerChosen = AnswerChosenModel(sequelize, DataTypes);

Answer.belongsTo(Question, {
    foreignKey: "idQuestion",
});
Question.hasMany(Answer, {
    foreignKey: "idQuestion",
})

Question.belongsTo(Test, {
    foreignKey: "idTest",
});
Test.hasMany(Question, {
    foreignKey: "idTest",
});

Test.hasMany(Attachement, {
    foreignKey: "idTest",
});
Attachement.belongsTo(Test, {
    foreignKey: "idTest",
});

Test.belongsTo(Module, {
    foreignKey: "idModule",
});
Module.hasMany(Test, {
    foreignKey: "idModule",
});

Module.hasMany(Objective, {
    foreignKey: "idModule",
});
Objective.belongsTo(Module, {
    foreignKey: "idModule"
});

//t_testDone -> t_users
TestDone.belongsTo(User, {
    foreignKey: "idTest"
});
User.hasMany(TestDone, {
    foreignKey: "idTest"
})

//t_testDone -> t_tests
TestDone.belongsTo(Test, {
    foreignKey: "idTest"
});
Test.hasMany(TestDone, {
    foreignKey: "idTest"
})

//t_answerDone -> t_testDone
AnswerDone.belongsTo(TestDone, {
    foreignKey: "idTestDone"
})
TestDone.hasMany(AnswerDone, {
    foreignKey: "idTestDone"
})

//t_answerDone -> t_questions
AnswerDone.belongsTo(Question, {
    foreignKey: "idQuestion"
})
Question.hasMany(AnswerDone, {
    foreignKey: "idQuestion"
})

//answers_chosen
Answer.belongsToMany(AnswerDone, {
    through: AnswerChosen,
    as: 'done_by',
    foreignKey: 'idAnswer',
    otherKey: 'idAnswerDone',
});
AnswerDone.belongsToMany(Answer, {
    through: AnswerChosen,
    as: 'made_for',
    foreignKey: 'idAnswerDone',
    otherKey: 'idAnswer',
})

//assigned_to
Test.belongsToMany(User, {
    through: AssignedTo,
    as: 'assignedUser',
    foreignKey: 'idTest',
    otherKey: 'idUser',
});
User.belongsToMany(Test, {
    through: AssignedTo,
    as: 'assigned_by',
    foreignKey: 'idUser',
    otherKey: 'idTest',
});

//created_by
Test.belongsToMany(User, {
    through: CreatedBy,
    as: 'createdTest',
    foreignKey: 'idTest',
    otherKey: 'idUser',
});
User.belongsToMany(Test, {
    through: CreatedBy,
    as: 'creator',
    foreignKey: 'idUser',
    otherKey: 'idTest'
});

export { sequelize, Answer, Attachement, Module, Objective, Question, Test, User, AssignedTo, CreatedBy, TestDone, AnswerDone, AnswerChosen };