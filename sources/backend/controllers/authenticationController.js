const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const notificacionAdmin = require('../utils/notificacionAdmin');
const verificarLogros = require('../utils/verificarLogros');

// Validaciones Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// Validación Campos Formulario
const validarCampos = (datos) => {
    const { nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword } = datos;

    if (!nombreUsuario || !emailUsuario || !passwordUsuario || !confirmarPassword) {
        return "Todos los campos son obligatorios.";
    }
    if (!emailRegex.test(emailUsuario)) {
        return "El Email no es válido.";
    }
    if (passwordUsuario !== confirmarPassword) {
        return "Las contraseñas no coinciden.";
    }
    if (!passwordRegex.test(passwordUsuario)) {
        return "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.";
    }
    return null;
};

module.exports = {
    iniciarSesion: async (req, res) => {
        try {
            const { emailUsuario, password } = req.body;

            // Validaciones
            if (!emailUsuario || !password) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }
            if (!emailRegex.test(emailUsuario)) {
                return res.status(400).json({ message: "El Email no es válido" });
            }

            // Buscar usuario con email
            const usuario = await Usuario.findOne({
                where: { email: { [Op.eq]: emailUsuario } }
            });

            if (!usuario) {
                return res.status(400).json({ message: "Email no encontrado" });
            }

            // Comparar contraseña
            const coincide = await bcrypt.compare(password, usuario.password);
            if (!coincide) {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }

            // Verificar logros del usuario
            await verificarLogros(usuario.idUsuario);

            // Crear token JWT
            const token = jwt.sign(
                { idUsuario: usuario.idUsuario, username: usuario.username, rol: usuario.rol },
                process.env.SECRET_KEY,
                { expiresIn: "12h" }
            );

            res.status(200).json({ message: "Se ha iniciado sesión correctamente", token });

        } catch (error) {
            console.error("Error en iniciarSesion:", error);
            res.status(500).json({ message: "No se ha podido iniciar sesión con esta cuenta" });
        }
    },
    registrarUsuario: async (req, res) => {
        try {
            const { nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword } = req.body;

            // Validaciones
            const errorMensaje = validarCampos({ nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword });
            if (errorMensaje) {
                return res.status(400).json({ message: errorMensaje });
            }

            // Verificar si el usuario ya existe (email o username)
            const usuarioExistente = await Usuario.findOne({
                where: {
                    [Op.or]: [
                        { username: { [Op.eq]: nombreUsuario } },
                        { email: { [Op.eq]: emailUsuario } }
                    ]
                }
            });

            if (usuarioExistente) {
                return res.status(400).json({
                    message: usuarioExistente.username === nombreUsuario
                        ? "El nombre de usuario ya está en uso."
                        : "El correo ya está en uso."
                });
            }

            // Encriptar contraseña y almacenar usuario
            const hashedPassword = await bcrypt.hash(passwordUsuario, 10);
            await Usuario.create({ username: nombreUsuario, email: emailUsuario, password: hashedPassword });
            
            // Crear notificación para el administrador
            await notificacionAdmin.crearNotificacion (
                'Nuevo registro de usuario',
                `${nombreUsuario} se ha registrado en la plataforma.`
            );

            res.status(201).json({ message: "Usuario registrado correctamente." });

        } catch (error) {
            console.error("Error en registrarUsuario:", error);
            res.status(500).json({ message: "No se ha podido registrar el nuevo usuario." });
        }
    }
};