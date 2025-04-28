const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Logro = sequelize.define('Logro', {
    idLogro: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fotoLogro: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'fotoLogro.png'
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidadRequerida: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    timestamps: false,
    tableName: 'Logro',
});

module.exports = Logro;