const sequelize = require('../config/database');
const Notificacion = require('../models/notificacionModel');

module.exports = {
    obtenerNotificaciones: async (req, res) => {
        try {
            const notificaciones = await Notificacion.findAll();
            res.status(200).json({ notificaciones });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error - No se ha podido obtener las notificaciones" });
        }
    }
}