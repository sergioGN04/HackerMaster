const sequelize = require('../config/database');
const Notificacion = require('../models/notificacionModel');

module.exports = {
    obtenerNotificaciones: async (req, res) => {
        try {
            const notificaciones = await Notificacion.findAll();
            res.status(200).json({ success: true, notificaciones });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, mensaje: "Error - No se ha podido obtener las notificaciones" });
        }
    }
}