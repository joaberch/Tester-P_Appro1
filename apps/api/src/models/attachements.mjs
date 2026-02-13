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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        idTest: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            tableName: "t_attachements",
        }
    );
};

export { AttachementModel };