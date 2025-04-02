const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const Usuario = require('../models/usuarioModel');

module.exports = {
    iniciarSesion: async (req, res) => {

    },
    registrarUsuario: async (req, res) => {
        try {
            const { nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword } = req.body;

            // Expresiones regulares
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

            // Validaciones
            // Todos los campos obligatorios
            if (!nombreUsuario || !emailUsuario || !passwordUsuario || !confirmarPassword) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }

            // Verificar si el usuario ya existe
            const usuarioConUsername = await Usuario.findOne({
                where: {
                    username: {
                        [Op.eq]: nombreUsuario
                    }
                }
            });

            if (usuarioConUsername) {
                return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
            }

            // Email correcto
            if (!emailRegex.test(emailUsuario)) {
                return res.status(400).json({ message: "El email no es válido" });
            }

            // Verificar si el email ya existe
            const usuarioConEmail = await Usuario.findOne({
                where: {
                    email: {
                        [Op.eq]: emailUsuario
                    }
                }
            });

            if (usuarioConEmail) {
                return res.status(400).json({ message: "El correo ya está en uso" });
            }

            // Las contraseñas coinciden
            if (passwordUsuario !== confirmarPassword) {
                return res.status(400).json({ message: "Las contraseñas no coinciden" });
            }

            // Contraseña segura
            if (!passwordRegex.test(passwordUsuario)) {
                return res.status(400).json({ message: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número" });
            }

            // Encriptar contraseña con bcrypt
            const hashedPassword = await bcrypt.hash(passwordUsuario, 10);

            // Insertar datos en la tabla de Usuario
            await Usuario.create({ username: nombreUsuario, email: emailUsuario, password: hashedPassword });

            res.status(200).json({ message: 'Se ha registrado el usuario correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'No se ha podido registrar el nuevo usuario' });
        }

    },
}