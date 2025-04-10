const Sequelize = require('sequelize');
const Usuario = require('../models/usuarioModel');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');
const Logro = require('../models/logroModel');
const UsuarioLogro = require('../models/usuarioLogroModel');

// Función para calcular el rango y puntuación
const calcularRangoYPuntuacion = async (idUsuario) => {
    // Obtener las máquinas completadas
    const intentosCompletados = await Intenta.findAll({
        where: { idUsuario, estado: 'Completado' },
        attributes: ['idMaquina'],
        group: ['idMaquina'],
        include: [{
            model: Maquina,
            attributes: ['idMaquina', 'nombre', 'puntuacion']
        }],
    });

    // Calcular puntos por máquinas
    const puntosMaquinas = intentosCompletados.reduce((total, intento) => {
        return total + (intento.Maquina?.puntuacion || 0);
    }, 0);

    // Obtener logros
    const logros = await UsuarioLogro.findAll({
        where: { idUsuario },
        include: [{ model: Logro }]
    });

    // Calcular puntos por logros
    const puntosLogros = logros.reduce((total, logro) => {
        return total + (logro.Logro?.puntuacion || 0);
    }, 0);

    // Puntuación total
    const puntuacion = puntosMaquinas + puntosLogros;

    // Determinar el rango
    let rango = 'Principiante';
    if (puntuacion >= 500 && puntuacion < 1000) {
        rango = 'Intermedio';
    } else if (puntuacion >= 1000 && puntuacion < 2000) {
        rango = 'Avanzado';
    } else if (puntuacion >= 2000) {
        rango = 'Experto';
    }

    return { puntuacion, rango };
}

module.exports = {
    obtenerResumenUsuario: async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;

            // Obtener datos del usuario
            const usuario = await Usuario.findOne({
                where: { idUsuario },
                attributes: ['username', 'fotoPerfil']
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const nombreUsuario = usuario.username;
            const fotoPerfil = `http://192.168.2.2:3000/uploads/usuarios/${usuario.fotoPerfil}`;

            // Obtener rango y puntuación
            const { puntuacion, rango } = await calcularRangoYPuntuacion(idUsuario);

            // Obtener el total de máquinas completadas
            const maquinasCompletadas = await Intenta.count({
                where: { idUsuario, estado: 'Completado' },
                distinct: true,
                col: 'idMaquina',
            });

            // Obtener el total de logros obtenidos
            const logrosCompletados = await UsuarioLogro.count({
                where: { idUsuario }
            });

            // Progreso
            const totalMaquinas = await Maquina.count();
            const totalLogros = await Logro.count();
            const totalPosibles = totalMaquinas + totalLogros;
            const totalCompletado = maquinasCompletadas + logrosCompletados;

            const progreso = totalPosibles > 0 ? Math.round((totalCompletado * 100) / totalPosibles) : 0;

            return res.status(200).json({
                nombreUsuario,
                fotoPerfil,
                rango,
                progreso,
                puntuacion,
                maquinasCompletadas,
                logrosCompletados
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error - No se ha podido obtener el resumen del usuario' });
        }
    },
    obtenerInformacionUsuario: async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;

            // Obtener datos del usuario
            const usuario = await Usuario.findOne({
                attributes: [
                    'idUsuario',
                    'username',
                    [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/usuarios/', Sequelize.col('fotoPerfil')), 'fotoPerfil'],
                    'email',
                    'pais',
                    'fechaNacimiento',
                    'telefono',
                    'fechaRegistro'
                ],
                where: { idUsuario }
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener rango y puntuación
            const { puntuacion, rango } = await calcularRangoYPuntuacion(idUsuario);

            // Obtener la última máquina intentada
            const ultimaMaquina = await Intenta.findOne({
                where: { idUsuario },
                order: [['fechaFin', 'DESC']],
                include: [{
                    model: Maquina,
                    attributes: ['idMaquina', 'nombre']
                }]
            });

            return res.status(200).json({
                usuario,
                rango,
                ultimaMaquina: ultimaMaquina?.Maquina || null
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error - No se ha podido obtener la información del usuario' });
        }
    }
}