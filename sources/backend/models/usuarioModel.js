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
        allowNull: false
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
        allowNull: true,
        defaultValue: 'fotoPerfil.png'
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'España'
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date('2000-01-01')
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: '000000000'
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    rol: {
        type: DataTypes.ENUM('Administrador', 'Usuario'),
        allowNull: true,
        defaultValue: 'Usuario'
    }
}, {
    timestamps: false,
    tableName: 'Usuario',
});

module.exports = Usuario;