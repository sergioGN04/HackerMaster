const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Evento = require('./eventoModel');
const Maquina = require('./maquinaModel');

const EventoMaquina = sequelize.define('EventoMaquina', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idEvento: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idMaquina: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'EventoMaquina',
});

// Relaciones tablas Evento y Maquina
Evento.hasMany(EventoMaquina, { foreignKey: 'idEvento' });
EventoMaquina.belongsTo(Evento, { foreignKey: 'idEvento' });

Maquina.hasMany(EventoMaquina, { foreignKey: 'idMaquina' });
EventoMaquina.belongsTo(Maquina, { foreignKey: 'idMaquina' });

module.exports = EventoMaquina;