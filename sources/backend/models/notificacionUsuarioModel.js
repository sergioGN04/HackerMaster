const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');
const Notificacion = require('./notificacionModel');

const NotificacionUsuario = sequelize.define('NotificacionUsuario', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idNotificacion: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'NotificacionUsuario',
});

// Relaciones tablas Usuario, Notificacion y NotificacionUsuario
Usuario.hasMany(NotificacionUsuario, { foreignKey: 'idUsuario' });
NotificacionUsuario.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Notificacion.hasMany(NotificacionUsuario, { foreignKey: 'idNotificacion' });
NotificacionUsuario.belongsTo(Notificacion, { foreignKey: 'idNotificacion' });

module.exports = NotificacionUsuario;