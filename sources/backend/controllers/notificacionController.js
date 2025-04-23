const { Op, Sequelize } = require('sequelize');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notificacionUsuarioModel');
const fs = require('fs');
const path = require('path');

module.exports = {
    obtenerNotificaciones: async (req, res) => {
        try {

            const notificaciones = await Notificacion.findAll({
                attributes: [
                    'idNotificacion',
                    [Sequelize.fn('CONCAT', `http://${process.env.IP_BACKEND}/uploads/notificaciones/`, Sequelize.col('fotoNotificacion')), 'fotoNotificacion'],
                    'titulo',
                    'descripcion',
                    'fechaLimite'
                ],
                where: { destinatario: 'Usuario' },
                order: [['fechaLimite', 'ASC']]
            });

            res.status(200).json({ notificaciones });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las notificaciones' });
        }
    },
    obtenerNotificacionesUsuario: async (req, res) => {
        const idUsuario = req.user.idUsuario;
        const username = req.user.username;
        const rol = req.user.rol;

        try {
            // Eliminar notificaciones vencidas (fechaLimite pasada)
            await Notificacion.destroy({
                where: {
                    fechaLimite: {
                        [Op.lt]: Sequelize.fn('NOW')
                    },
                    destinatario: 'Usuario'
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
                    [Sequelize.fn('CONCAT', `http://${process.env.IP_BACKEND}/uploads/notificaciones/`, Sequelize.col('fotoNotificacion')), 'fotoNotificacion'],
                    'titulo',
                    'descripcion',
                    'fechaLimite'
                ],
                where: {
                    destinatario: rol,
                    idNotificacion: {
                        [Op.notIn]: idsNotificacionesVistas.length > 0 ? idsNotificacionesVistas : [0]
                    }
                },
                order: [['fechaLimite', 'ASC']],
                limit: 3
            });

            res.status(200).json({ username, rol, nuevasNotificaciones });

        } catch (error) {
            res.status(500).json({ message: 'Error del servidor al obtener las notificaciones del usuario' });
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
            res.status(500).json({ message: 'Error al marcar notificaciones como vistas' });
        }
    },
    crearNotificacion: async (req, res) => {
        try {
            const { titulo, descripcion, fechaLimite } = req.body;

            // Verificamos si subió correctamente la imagen
            if (!req.file) {
                return res.status(400).json({ message: 'La imagen de la notificación es obligatoria' });
            }

            // Obtenemos el nombre del archivo de la imagen
            const fotoNotificacion = req.file.filename;

            // Almacenamos la notificación
            await Notificacion.create({
                titulo,
                descripcion,
                fechaLimite,
                destinatario: 'Usuario',
                fotoNotificacion
            });

            res.status(200).json({ message: 'Se ha creado la notificación correctamente' });

        } catch (error) {
            res.status(500).json({ message: 'Error al crear la notificación' });
        }
    },
    eliminarNotificacion: async (req, res) => {
        const { idNotificacion } = req.query;

        try {
            // Buscar la notificación
            const notificacion = await Notificacion.findByPk(idNotificacion);

            if (!notificacion) {
                return res.status(404).json({ message: 'Notificación no encontrada' });
            }

            // Obtenemos la ruta del archivo a eliminar
            const rutaImagen = path.join(__dirname, '../uploads/notificaciones', notificacion.fotoNotificacion);

            // Eliminar archivo si existe
            if (notificacion.fotoNotificacion != 'fotoNotificacion.png' && fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
            } else {
                console.error('Foto de la notificación no encontrada');
            }

            // Eliminar la notificación
            await notificacion.destroy();

            res.status(200).json({ message: 'Notificación eliminada correctamente' });

        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la notificación' });
        }
    }
}