const TestDoneModel = (sequelize, DataTypes) => {
    return sequelize.define("testDone", {
        idTestDone: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        idTest: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            createdAt: completedAt,
            updatedAt: false,
            freezeTableName: true,
            tableName: "t_testDone",
        }
    );
};

export { TestDoneModel }