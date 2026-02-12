const AnswerModel = (sequelize, DataTypes) => {
    return sequelize.define("Answer", {
        idAnswer: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        idQuestion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: false,
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            freezeTableName: true,
            tableName: "t_tests",
        }
    );
};

export { AnswerModel };