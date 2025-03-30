const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const maquinaController = require('../controllers/maquinaController');
const notificacionController = require('../controllers/notificacionController');
const logroController = require('../controllers/logroController');
const informacionSitioController = require('../controllers/informacionSitioController');

// Rutas HackerMaster
// Informacion del sitio
router.get('/api/estadisticas-actuales', informacionSitioController.obtenerEstadisticasActuales);

// Usuarios
router.get('/api/usuarios', usuarioController.obtenerUsuarios);

// Maquinas
router.get('/api/maquinas', maquinaController.obtenerMaquinas);

// Notificaciones
router.get('/api/notificaciones', notificacionController.obtenerNotificaciones);

// Logros
router.get('/api/logros', logroController.obtenerLogros);

module.exports = router;