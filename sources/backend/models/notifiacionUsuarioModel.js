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
    estado: {
        type: DataTypes.ENUM('Visto', 'Pendiente'),
        allowNull: false,
        defaultValue: 'Pendiente'
    }
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