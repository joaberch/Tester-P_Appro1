const AttachementModel = (sequelize, DataTypes) => {
    return sequelize.define("Attachement", {
        idAttachement: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        idTest: {
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

export { AttachementModel };