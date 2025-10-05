
require("dotenv").config();
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    console.log(`✅ Checking database "${process.env.DB_NAME}"...`);

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Database "${process.env.DB_NAME}" is ready.`);

    await connection.end();
  } catch (err) {
    console.error("❌ Error creating database:", err.message);
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

module.exports = { sequelize, createDatabaseIfNotExists };
