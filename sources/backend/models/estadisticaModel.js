const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');

const Estadistica = sequelize.define('Estadistica', {
    idEstadistica: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    puntuacionTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rango: {
        type: DataTypes.ENUM('Noob', 'Intermedio', 'Avanzado', 'Experto'),
        allowNull: false,
        defaultValue: 'Noob'
    },
    maquinasCompletadas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    progresoGeneral: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    tiempoTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fechaActualizacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'Estadistica',
});

// Relaciones tablas Usuario y Estadistica
Usuario.hasMany(Estadistica, { foreignKey: 'idUsuario' });
Estadistica.belongsTo(Usuario, { foreignKey: 'idUsuario' });

module.exports = Estadistica;