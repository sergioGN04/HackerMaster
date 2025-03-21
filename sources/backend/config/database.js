const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql'
});

module.exports = sequelize;