const sequelize = require('../config/database');
const nodemailer = require('nodemailer');
const Usuario = require('../models/usuarioModel');

module.exports = {
    enviarCorreo: async (req, res) => {
        const { nombreUsuario, asunto, descripcion } = req.body;

        if (!nombreUsuario || !asunto || !descripcion) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        try {
            // Verificar si el usuario existe
            const usuario = await Usuario.findOne({ where: { username: nombreUsuario } });

            if (!usuario) {
                return res.status(404).json({ message: "El nombre de usuario no existe" });
            }

            // Configuración del transportador de nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Obtener la fecha formateada DD/MM/YYYY
            const date = new Date();
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            // Configuración del correo
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: `${nombreUsuario} - ${asunto} (${fechaFormateada})`,
                text: `${descripcion}`,
            };

            // Enviar el correo
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Se ha enviado el email correctamente" });

        } catch (error) {
            console.error("Error al enviar el email:", error);
            res.status(500).json({ message: "No se ha podido enviar el email" });
        }
    }
}