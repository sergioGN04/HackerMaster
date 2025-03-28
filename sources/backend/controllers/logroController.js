const sequelize = require('../config/database');
const Logro = require('../models/logroModel');

module.exports = {
    obtenerLogros: async (req, res) => {
        try {
            const logros = await Logro.findAll();
            res.status(200).json({ success: true, logros });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Error - No se han podido obtener los logros" });
        }
    }
}