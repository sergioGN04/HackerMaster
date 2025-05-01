const UsuarioLogro = require('../models/usuarioLogroModel');
const Logro = require('../models/logroModel');
const Intenta = require('../models/IntentaModel');
const { Op } = require('sequelize');

async function verificarLogros(idUsuario) {
    // Obtener el total de máquinas completadas
    const maquinasCompletadas = await Intenta.count({
        where: { idUsuario, estado: 'Completado' },
        distinct: true,
        col: 'idMaquina',
    });

    // Obtener todos los logros disponibles con la cantidad de máquinas completadas que tiene el usuario
    const logrosDisponibles = await Logro.findAll({
        where: {
            cantidadRequerida: {
                [Op.lte]: maquinasCompletadas
            }
        }
    });

    // Verificar si el usuario ya tiene cada logro y si no los tiene, crearlos
    for (const logro of logrosDisponibles) {
        const yaTiene = await UsuarioLogro.findOne({
            where: {
                idUsuario,
                idLogro: logro.idLogro
            }
        });

        if (!yaTiene) {
            await UsuarioLogro.create({
                idUsuario,
                idLogro: logro.idLogro,
                nuevoLogro: true
            });
        }
    }
}

module.exports = verificarLogros;