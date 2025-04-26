const Notificacion = require('../models/notificacionModel');

// Función para crear una notificación de administrador
async function crearNotificacion(titulo, descripcion) {
  try {
    await Notificacion.create({
      titulo,
      descripcion,
      fechaLimite: new Date(),
      destinatario: 'Administrador'
    });
  } catch (error) {
    console.error('Error al crear la notificación del Admin');
  }
}

module.exports = { crearNotificacion };