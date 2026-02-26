const AnswerDoneModel = (sequelize, DataTypes) => {
    return sequelize.define("answerDone", {
        idAnswerDone: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        openText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pointGotten: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idQuestion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idTestDone: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            tableName: "t_answerDone",
        }
    );
};

export { AnswerDoneModel }