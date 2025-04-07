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
        allowNull: false
    },
    fotoNotificacion: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'fotoNotificacion.png'
    },
    fechaLimite: {
        type: DataTypes.DATE,
        allowNull: false
    },
    destinatario: {
        type: DataTypes.ENUM('Administrador', 'Usuario'),
        allowNull: false,
        defaultValue: 'Usuario'
    }
}, {
    timestamps: false,
    tableName: 'Notificacion',
});

module.exports = Notificacion;