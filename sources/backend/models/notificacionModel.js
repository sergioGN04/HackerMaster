const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
    idNotificacion: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fotoNotificacion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaLimite: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Notificacion',
});

module.exports = Notificacion;