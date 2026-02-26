const AnswerChosenModel = (sequelize, DataTypes) => {
    return sequelize.define("answers_chosen", {
        idAnswer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 't_answers', key: 'idAnswer' },
        },
        idAnswerDone: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 't_answerDone', key: 'idAnswerDone' },
        },
    },
    {
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
        tableName: "answers_chosen",
    }
    );
};

export { AnswerChosenModel };