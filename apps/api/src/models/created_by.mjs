const CreatedByModel = (sequelize, DataTypes) => {
    return sequelize.define("created_by",
        {
            idUser: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 't_users', key: 'idUser' },
            },
            idTest: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 't_tests', key: 'idTest' },
            },
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            tableName: "created_by",
        }
    );
};

export { CreatedByModel };