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
        idTest: { //TODO - prevent duplicate of idTest && idUser?
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: true, //Because is managed in the backend
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            freezeTableName: true,
            tableName: "t_testDone",
        }
    );
};

export { TestDoneModel }