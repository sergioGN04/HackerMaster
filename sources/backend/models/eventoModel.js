const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');

const Evento = sequelize.define('Evento', {
    idEvento: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fotoEvento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Evento',
});

// Relaciones tablas Usuario y Evento
Usuario.hasMany(Evento, { foreignKey: 'idUsuario' });
Evento.belongsTo(Usuario, { foreignKey: 'idUsuario' });

module.exports = Evento;