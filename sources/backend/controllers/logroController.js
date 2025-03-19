const sequelize = require('../config/database');
const Logro = require('../models/logroModel');

module.exports = {
    obtenerLogros: async (req, res) => {
        try {
            const logros = await Logro.findAll();
            res.json(logros);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se han podido obtener los logros" });
        }
    }
}