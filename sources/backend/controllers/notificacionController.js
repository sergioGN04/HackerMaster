const { Op, Sequelize } = require('sequelize');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');

module.exports = {
    obtenerNotificaciones: async (req, res) => {
        const idUsuario = req.user.idUsuario;
        const username = req.user.username;

        try {
            // Eliminar notificaciones vencidas (fechaLimite pasada)
            await Notificacion.destroy({
                where: {
                    fechaLimite: {
                        [Op.lt]: Sequelize.fn('NOW')
                    }
                }
            });
            
            // Obtener los IDs de las notificaciones que ya han sido vistas por el usuario
            const notificacionesVistas = await NotificacionUsuario.findAll({
                where: { idUsuario },
                attributes: ['idNotificacion']
            });

            const idsNotificacionesVistas = notificacionesVistas.map(n => n.idNotificacion);

            // Buscar notificaciones que no han sido vistas por el usuario
            const nuevasNotificaciones = await Notificacion.findAll({
                attributes: [
                    'idNotificacion',
                    [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/notificaciones/', Sequelize.col('fotoNotificacion')), 'fotoNotificacion'],
                    'titulo',
                    'descripcion',
                    'fechaLimite'
                ],
                where: {
                    destinatario: 'Usuario',
                    idNotificacion: {
                        [Op.notIn]: idsNotificacionesVistas.length > 0 ? idsNotificacionesVistas : [0]
                    }
                },
                order: [['fechaLimite', 'ASC']],
                limit: 3
            });

            return res.json({ username, nuevasNotificaciones });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error del servidor' });
        }
    },
    marcarNotificacionesComoVistas: async (req, res) => {
        const { idsNotificaciones } = req.query;
        const idUsuario = req.user.idUsuario;

        try {
            // Convertir en un array de enteros
            const idsArray = idsNotificaciones.split(',').map(id => parseInt(id)).filter(Boolean);

            const registros = idsArray.map(idNotificacion => ({
                idUsuario,
                idNotificacion
            }));

            // Marcar las notificaciones como vistas para el usuario
            await NotificacionUsuario.bulkCreate(registros, {
                ignoreDuplicates: true
            });

            res.status(200).json({ message: 'Notificaciones marcadas como vistas' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al marcar notificaciones como vistas' });
        }
    }

}