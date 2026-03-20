const AttachmentModel = (sequelize, DataTypes) => {
    return sequelize.define("Attachment", {
        idAttachment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileContent: {
            type: DataTypes.BLOB('long'),
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
            tableName: "t_attachments",
        }
    );
};

export { AttachmentModel };