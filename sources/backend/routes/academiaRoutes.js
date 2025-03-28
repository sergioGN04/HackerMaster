const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const maquinaController = require('../controllers/maquinaController');
const notificacionController = require('../controllers/notificacionController');
const logroController = require('../controllers/logroController');
const estadisticaController = require('../controllers/estadisticaController');
const informacionSitioController = require('../controllers/informacionSitioController');

// Rutas HackerMaster
// Informacion del sitio
router.get('/estadisticas-actuales', informacionSitioController.obtenerEstadisticasActuales);

// Usuarios
router.get('/usuarios', usuarioController.obtenerUsuarios);

// Maquinas
router.get('/maquinas', maquinaController.obtenerMaquinas);

// Notificaciones
router.get('/notificaciones', notificacionController.obtenerNotificaciones);

// Logros
router.get('/logros', logroController.obtenerLogros);

// Estadisticas
router.get('/estadisticas', estadisticaController.obtenerEstadisticas);

module.exports = router;