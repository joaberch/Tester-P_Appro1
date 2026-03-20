const DocumentModel = (sequelize, DataTypes) => {
    return sequelize.define("Document", {
        idDocument: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.BLOB('long'),
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
        {
            timestamps: true,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            tableName: "t_documents",
        }
    );
};

export { DocumentModel };