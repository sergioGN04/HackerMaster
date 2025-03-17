const express = require('express');
const router = express.Router();
//const usuarioController = require('../controllers/usuarioController');
//const maquinaController = require('../controllers/maquinaController');
//const usuarioMaquinaController = require('../controllers/usuarioMaquinaController');

// Prueba Tablas Base de Datos
const Usuario = require('../models/usuarioModel');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');
const Estadistica = require('../models/estadisticaModel');
const Evento = require('../models/eventoModel');
const EventoMaquina = require('../models/eventoMaquinaModel');
const UsuarioLogro = require('../models/usuarioLogroModel');
const Notificacion = require('../models/notificacionModel');
const NotificacionUsuario = require('../models/notifiacionUsuarioModel');

// Rutas Academia
// Usuarios
//router.get('/usuarios', usuarioController.obtenerUsuarios);

// Maquina
//router.get('/maquinas', maquinaController.obtenerMaquinas);

// UsuarioMaquina
//router.get('/usuariosMaquinas', usuarioMaquinaController.obtenerUsuariosMaquinas);

module.exports = router;