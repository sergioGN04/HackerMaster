const sequelize = require('../config/database');
const Usuario = require('../models/usuarioModel');

module.exports = {
    obtenerUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            res.status(200).json({ success: true, usuarios });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, mensaje: "Error - No se ha podido obtener los usuarios" });
        }
    }
}