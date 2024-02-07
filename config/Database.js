import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from 'mysql2'
dotenv.config();

// const db = new Sequelize(process.env.DB_DBNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql"
// });

const db = new Sequelize({
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialectModule: mysql2,
    benchmark: true,
    dialect: "mysql"
})
export default db;