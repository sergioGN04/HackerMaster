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
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Completado', 'En Progreso'),
        allowNull: false,
        defaultValue: 'En Progreso'
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