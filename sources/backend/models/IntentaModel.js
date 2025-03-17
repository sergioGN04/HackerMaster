const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');
const Maquina = require('./maquinaModel');

const Intenta = sequelize.define('Intenta', {
    idIntento: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idMaquina: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.ENUM('completado', 'en progreso'),
        allowNull: false,
        defaultValue: 'en progreso'
    }
}, {
    timestamps: false,
    tableName: 'Intenta',
});

// Relaciones tablas Usuario, Maquina e Intenta
Usuario.hasMany(Intenta, { foreignKey: 'idUsuario' });
Intenta.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Maquina.hasMany(Intenta, { foreignKey: 'idMaquina' });
Intenta.belongsTo(Maquina, { foreignKey: 'idMaquina' });

module.exports = Intenta;