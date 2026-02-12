import { DataTypes, Sequelize } from "sequelize";
import dotenv from "dotenv";
import { AnswerModel } from "../models/answers.mjs";
import { AttachementModel } from "../models/attachements.mjs";
import { ModuleModel } from "../models/modules.mjs";
import { ObjectiveModel } from "../models/objectives.mjs";
import { QuestionModel } from "../models/questions.mjs";
import { TestModel } from "../models/tests.mjs";
import { UserModel } from "../models/users.mjs";
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

//assigned_to
Test.belongsToMany(User, { through: 'assigned_to' })
User.belongsToMany(Test, { through: 'assigned_to' })

//created_by
Test.belongsToMany(User, { through: 'created_by' })
User.belongsToMany(Test, { through: 'created_by' })

export { sequelize, Answer, Attachement, Module, Objective, Question, Test, User };