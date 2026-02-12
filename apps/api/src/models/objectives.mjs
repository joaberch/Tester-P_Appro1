const ObjectiveModel = (sequelize, DataTypes) => {
    return sequelize.define("Objective", {
        idObjective: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bloomLevel: {
            type: DataTypes.TINYINT,
            validate: {
                min: 1,
                max: 6,
            },
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        idModule: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

export { ObjectiveModel };