import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const DB_NAME = process.env.DB_NAME;
const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;

const sequelize = new Sequelize(
    DB_NAME,
    USERNAME,
    PASSWORD,
    {
        host: HOST,
        port: PORT,
        dialect: "mariadb",
        logging: false,
    }
)

export { sequelize };