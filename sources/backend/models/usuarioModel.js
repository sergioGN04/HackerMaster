const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Error - Email Incorrecto'
            }
        }
    },
    fotoPerfil: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    rol: {
        type: DataTypes.ENUM('Administrador', 'Usuario'),
        allowNull: false,
        defaultValue: 'Usuario'
    }
}, {
    timestamps: false,
    tableName: 'Usuario',
});

module.exports = Usuario;