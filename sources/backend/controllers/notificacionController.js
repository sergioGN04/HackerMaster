const { Op, Sequelize } = require('sequelize');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');

module.exports = {
    obtenerNotificaciones: async (req, res) => {
        const idUsuario = req.user.idUsuario;
        const username = req.user.username;

        try {
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
                    [ Sequelize.fn('CONCAT','http://192.168.2.2:3000/uploads/notificaciones/', Sequelize.col('fotoNotificacion')),'fotoNotificacion' ],
                    'titulo',
                    'descripcion',
                    'fechaLimite'
                ],
                where: {
                    destinatario: 'Usuario',
                    idNotificacion: {
                        [Op.notIn]: idsNotificacionesVistas.length > 0 ? idsNotificacionesVistas : [0]
                    }
                }
            });

            return res.json({ username, nuevasNotificaciones });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error del servidor' });
        }
    }
}