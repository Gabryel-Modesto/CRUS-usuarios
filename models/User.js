const { DataTypes } = require('sequelize');

const db = require('../db/conexao')

const User = db.define('User', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    occpation:{
        type: DataTypes.STRING,
        required: true
    },
    newsletter: {
        type: DataTypes.BOOLEAN,
    },
});

module.exports = User;