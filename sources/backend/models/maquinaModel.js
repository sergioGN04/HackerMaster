const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');

const Maquina = sequelize.define('Maquina', {
    idMaquina: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fotoMaquina: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dificultad: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    writeUp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    flagUsuario: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    flagRoot: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Aceptada', 'En Espera'),
        allowNull: false,
        defaultValue: 'En Espera'
    }
}, {
    timestamps: false,
    tableName: 'Maquina',
});

// Relaciones tablas Maquina y Usuario
Usuario.hasMany(Maquina, { foreignKey: 'idUsuario' });
Maquina.belongsTo(Usuario, { foreignKey: 'idUsuario' });

module.exports = Maquina;