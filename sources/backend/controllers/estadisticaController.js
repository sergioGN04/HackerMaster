const sequelize = require('../config/database');
const Estadistica = require('../models/estadisticaModel');

module.exports = {
    obtenerEstadisticas: async (req, res) => {
        try {
            const estadisticas = await Estadistica.findAll();
            res.status(200).json({ estadisticas });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se han podido obtener las estadisticas" });
        }
    }
}