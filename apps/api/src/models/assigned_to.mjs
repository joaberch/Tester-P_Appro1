const AssignedToModel = (sequelize, DataTypes) => {
    return sequelize.define("assigned_to",
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
            tableName: "assigned_to",
        }
    );
};

export { AssignedToModel };