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

// Maquinas
router.get('/api/maquinas-recomendadas', verifyToken, maquinaController.obtenerMaquinasRecomendadas);
router.get('/api/maquinas-en-progreso', verifyToken, maquinaController.obtenerMaquinasEnProgreso);

// Notificaciones
router.get('/api/notificaciones', notificacionController.obtenerNotificaciones);

// Logros
router.get('/api/logros', logroController.obtenerLogros);

module.exports = router;