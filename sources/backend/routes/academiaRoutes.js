const express = require('express');
const router = express.Router();
const informacionSitioController = require('../controllers/informacionSitioController');
const contactoController = require('../controllers/contactoController');
const authenticationController = require('../controllers/authenticationController')
const usuarioController = require('../controllers/usuarioController');
const maquinaController = require('../controllers/maquinaController');
const notificacionController = require('../controllers/notificacionController');
const logroController = require('../controllers/logroController');
const verifyToken = require('../middlewares/verifyToken');
const uploadUsuario = require('../config/multerUsuarioConfig');
const uploadMaquina = require('../config/multerMaquinaConfig');
const uploadNotificacion = require('../config/multerNotificacionConfig');

// ------ Rutas HackerMaster ------
// Informacion del sitio
router.get('/api/estadisticas-actuales', informacionSitioController.obtenerEstadisticasActuales);

// Ruta Contacto
router.post('/api/contacto', contactoController.enviarCorreo);

// Rutas Login y Registro
router.post('/api/login', authenticationController.iniciarSesion);
router.post('/api/register', authenticationController.registrarUsuario);

// Usuarios
router.get('/api/dashboard-usuario', verifyToken, usuarioController.obtenerResumenUsuario);
router.get('/api/informacion-usuario', verifyToken, usuarioController.obtenerInformacionUsuario);
router.post('/api/actualizar-imagen-perfil', verifyToken, uploadUsuario, usuarioController.actualizarFotoPerfil);
router.put('/api/actualizar-datos-usuario', verifyToken, usuarioController.actualizarDatosUsuario);
router.post('/api/actualizar-password', verifyToken, usuarioController.actualizarPassword);
router.get('/api/ranking', verifyToken, usuarioController.obtenerRanking);
router.get('/api/usuarios-registrados', verifyToken, usuarioController.obtenerUsuariosRegistrados);
router.put('/api/cambiar-rol', verifyToken, usuarioController.cambiarRolUsuario);
router.delete('/api/eliminar-usuario', verifyToken, usuarioController.eliminarUsuario);

// Maquinas
router.get('/api/maquinas-recomendadas', verifyToken, maquinaController.obtenerMaquinasRecomendadas);
router.get('/api/maquinas-en-progreso', verifyToken, maquinaController.obtenerMaquinasEnProgreso);
router.get('/api/obtener-maquinas-filtradas', verifyToken, maquinaController.obtenerMaquinasFiltradas);
router.post('/api/crear-maquina', verifyToken, uploadMaquina, maquinaController.crearMaquina);
router.get('/api/maquina-detalle', verifyToken, maquinaController.obtenerDetallesMaquina);
router.post('/api/desplegar-maquina', verifyToken, maquinaController.desplegarMaquina);
router.post('/api/detener-maquina', verifyToken, maquinaController.detenerMaquina);
router.post('/api/verificar-flags', verifyToken, maquinaController.verificarMaquina);
router.get('/api/solicitudes-maquinas', verifyToken, maquinaController.obtenerSolicitudesMaquinas);
router.get('/api/maquinas-registradas', verifyToken, maquinaController.obtenerMaquinasRegistradas);
router.put('/api/aceptar-solicitud', verifyToken, maquinaController.aceptarSolicitud);
router.put('/api/denegar-solicitud', verifyToken, maquinaController.denegarSolicitud);
router.delete('/api/eliminar-maquina', verifyToken, maquinaController.eliminarMaquina);

// Notificaciones
router.get('/api/notificaciones', verifyToken, notificacionController.obtenerNotificaciones);
router.get('/api/notificaciones-usuario', verifyToken, notificacionController.obtenerNotificacionesUsuario);
router.put('/api/marcar-notificaciones', verifyToken, notificacionController.marcarNotificacionesComoVistas);
router.post('/api/crear-notificacion', verifyToken, uploadNotificacion, notificacionController.crearNotificacion);
router.delete('/api/eliminar-notificacion', verifyToken, notificacionController.eliminarNotificacion);

// Logros
router.get('/api/logros-usuario', verifyToken, logroController.obtenerLogrosUsuario);

module.exports = router;