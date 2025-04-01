const sequelize = require('../config/database');
const nodemailer = require('nodemailer');

module.exports = {
    enviarCorreo: async (req, res) => {
        const { nombreUsuario, asunto, descripcion } = req.body;

        if (!nombreUsuario || !asunto || !descripcion ) {
            return res.status(400).json({ message: "Error - Todos los campos son obligatorios."});
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const date = new Date();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `${nombreUsuario} - ${asunto} (${date.toLocaleDateString('es-ES')})`,
            text: `Username: ${nombreUsuario}\n\nMensaje:\n${descripcion}`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Se ha enviado el email correctamente"});
        } catch (error) {
            res.status(500).json({ message: "Error - No se ha podido enviar el email."});
        }

    }
}