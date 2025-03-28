const sequelize = require('../config/database');
const Estadistica = require('../models/estadisticaModel');

module.exports = {
    obtenerEstadisticas: async (req, res) => {
        try {
            const estadisticas = await Estadistica.findAll();
            res.status(200).json({ success: true, estadisticas });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Error - No se han podido obtener las estadisticas" });
        }
    }
}