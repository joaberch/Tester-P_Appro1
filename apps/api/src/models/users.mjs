const UserModel = (sequelize, DataTypes) => {
    return sequelize.define("User", {
        idUser: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING(7),
            validate: {
                len: [7, 7],
            },
            allowNull: false,
            unique: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(['student', 'teacher', 'admin']),
            allowNull: false,
            defaultValue: "student"
        },
        hashedPassword: {
            type: DataTypes.STRING(60), //TODO fix length to 60?
            validate: {
                len: [60, 60],
            },
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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

export { UserModel }