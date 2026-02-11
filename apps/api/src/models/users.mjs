const UserModel = (sequelize, DataTypes) => {
    return sequelize.define("User", {
        idUser: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING, //TODO fix length to 7?
            validate: {
                min: 7,
                max: 7,
            },
            allowNull: false,
            //isUnique TODO
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
            type: DataTypes.STRING, //TODO validate 'isIn' with enum of possibilities?
            allowNull: false,
        },
        hashedPassword: {
            type: DataTypes.STRING, //TODO fix length to 60?
            validate: {
                min: 60,
                max: 60,
            },
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
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

export { UserModel }