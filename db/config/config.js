const dotenv = require('dotenv').config();

module.exports = {
  development: {
    username: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASS,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    seederStorage: "sequelize",
    migrationStorage: "sequelize",
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    seederStorage: "sequelize",
    migrationStorage: "sequelize",
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
    seederStorage: "sequelize",
    migrationStorage: "sequelize",
  }
};