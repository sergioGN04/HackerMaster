const sequelize = require('../config/database');
const Usuario = require('../models/usuarioModel');
const Maquina = require('../models/maquinaModel');
const Logro = require('../models/logroModel');
const Intento = require('../models/IntentaModel');

module.exports = {
    obtenerEstadisticasActuales: async (req, res) => {
        try {
            const totalUsuarios = await Usuario.count();
            const totalMaquinas = await Maquina.count();
            const totalLogros = await Logro.count();
            const totalIntentos = await Intento.count();
            res.status(200).json({ success: true,totalUsuarios,totalMaquinas,totalLogros,totalIntentos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Error - No se han podido obtener las estadisticas actuales" });
        }
    }
}