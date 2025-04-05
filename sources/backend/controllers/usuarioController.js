const sequelize = require('../config/database');
const Usuario = require('../models/usuarioModel');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');
const Logro = require('../models/logroModel');
const UsuarioLogro = require('../models/usuarioLogroModel');

module.exports = {
    obtenerResumenUsuario: async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;

            // Nombre de Usuario
            const nombreUsuario = req.user.username;

            // Foto de Usuario
            const foto = await Usuario.findOne({
                where: { idUsuario },
                attributes: ['fotoPerfil']
            });

            const fotoPerfil = foto.fotoPerfil;
            

            // Máquinas completadas
            const intentosCompletados = await Intenta.findAll({
                where: { idUsuario, estado: 'Completado' },
                attributes: ['idMaquina'],
                group: ['idMaquina'],
                include: [{
                    model: Maquina,
                    attributes: ['idMaquina', 'nombre', 'puntuacion']
                }],
            });

            const maquinasCompletadas = intentosCompletados.length;

            // Puntos Máquinas
            const puntosMaquinas = intentosCompletados.reduce((total, intento) => {
                return total + (intento.Maquina?.puntuacion || 0);
            }, 0);

            // Logros obtenidos
            const logros = await UsuarioLogro.findAll({
                where: { idUsuario },
                include: [{ model: Logro }]
            });

            const logrosCompletados = logros.length;

            // Puntos Logros
            const puntosLogros = logros.reduce((total, logro) => {
                return total + (logro.Logro?.puntuacion || 0);
            }, 0);

            // Puntuación total
            const puntuacion = puntosMaquinas + puntosLogros;

            // Total de máquinas posibles y logros posibles
            const totalMaquinas = await Maquina.count();
            const totalLogros = await Logro.count();

            // Progreso
            const totalPosibles = totalMaquinas + totalLogros;
            const totalCompletado = maquinasCompletadas + logrosCompletados;

            const progreso = totalPosibles > 0 ? Math.round((totalCompletado * 100) / totalPosibles) : 0;

            // Rango
            let rango = 'Principiante';
            if (puntuacion >= 500 && puntuacion < 1000) {
                rango = 'Intermedio';
            } else if (puntuacion >= 1000 && puntuacion < 2000) {
                rango = 'Avanzado';
            } else if (puntuacion >= 2000) {
                rango = 'Experto';
            }
            
            res.status(200).json({ nombreUsuario, fotoPerfil, rango, progreso, puntuacion, maquinasCompletadas, logrosCompletados });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error - No se ha podido obtener el resumen del usuario' });
        }
    }
}