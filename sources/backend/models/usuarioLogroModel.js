const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');
const Logro = require('./logroModel');

const UsuarioLogro = sequelize.define('UsuarioLogro', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    idLogro: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fechaObtencion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'UsuarioLogro',
});

// Relaciones tablas Usuario, Logro y UsuarioLogro
Usuario.hasMany(UsuarioLogro, { foreignKey: 'idUsuario' });
UsuarioLogro.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Logro.hasMany(UsuarioLogro, { foreignKey: 'idLogro' });
UsuarioLogro.belongsTo(Logro, { foreignKey: 'idLogro' });

module.exports = UsuarioLogro;