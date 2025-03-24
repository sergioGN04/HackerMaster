const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');

const Log = sequelize.define('Log', {
    idLog: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    entidad: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    accion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'Log',
});

// Relaciones tablas Usuario y Log
Usuario.hasMany(Log, { foreignKey: 'idUsuario' });
Log.belongsTo(Usuario, { foreignKey: 'idUsuario' });

module.exports = Log;