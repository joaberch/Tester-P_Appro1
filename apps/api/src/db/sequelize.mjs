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
    foreignKey: "fk_question",
});
Question.hasMany(Answer, {
    foreignKey: "fk_question",
})

Question.belongsTo(Test, {
    foreignKey: "fk_test",
});
Test.hasMany(Question, {
    foreignKey: "fk_test",
});

Test.hasMany(Attachement, {
    foreignKey: "fk_test",
});
Attachement.belongsTo(Test, {
    foreignKey: "fk_test",
});

Test.belongsTo(Module, {
    foreignKey: "fk_module",
});
Module.hasMany(Test, {
    foreignKey: "fk_module",
});

Module.hasMany(Objective, {
    foreignKey: "fk_module",
});
Objective.belongsTo(Module, {
    foreignKey: "fk_module"
});

//assigned_to
Test.belongsToMany(User, { through: 'assigned_to' })
User.belongsToMany(Test, { through: 'assigned_to' })

//created_by
Test.belongsToMany(User, { through: 'created_by' })
User.belongsToMany(Test, { through: 'created_by' })

export { sequelize, Answer, Attachement, Module, Objective, Question, Test, User };