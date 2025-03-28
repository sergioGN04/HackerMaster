const sequelize = require('../config/database');
const Maquina = require('../models/maquinaModel');

module.exports = {
    obtenerMaquinas: async (req, res) => {
        try {
            const maquinas = await Maquina.findAll();
            res.status(200).json({ success: true, maquinas });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, mensaje: "Error - No se ha podido obtener las maquinas" });
        }
    }
}