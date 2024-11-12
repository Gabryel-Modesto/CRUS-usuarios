const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('nodesequelize','root', '1937', {
    host: 'localhost',
    dialect: 'mysql'
}) 

module.exports = sequelize;