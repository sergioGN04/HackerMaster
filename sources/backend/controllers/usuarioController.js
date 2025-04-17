const Sequelize = require('sequelize');
const Usuario = require('../models/usuarioModel');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');
const Logro = require('../models/logroModel');
const UsuarioLogro = require('../models/usuarioLogroModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Función para calcular el rango y puntuación
const calcularRangoYPuntuacion = async (idUsuario) => {
    // Obtener las máquinas completadas
    const intentosCompletados = await Intenta.findAll({
        where: { idUsuario, estado: 'Completado' },
        attributes: ['idMaquina'],
        group: ['idMaquina'],
        include: [{
            model: Maquina,
            attributes: ['idMaquina', 'nombre', 'puntuacion']
        }],
    });

    // Calcular puntos por máquinas
    const puntosMaquinas = intentosCompletados.reduce((total, intento) => {
        return total + (intento.Maquina?.puntuacion || 0);
    }, 0);

    // Obtener logros
    const logros = await UsuarioLogro.findAll({
        where: { idUsuario },
        include: [{ model: Logro }]
    });

    // Calcular puntos por logros
    const puntosLogros = logros.reduce((total, logro) => {
        return total + (logro.Logro?.puntuacion || 0);
    }, 0);

    // Puntuación total
    const puntuacion = puntosMaquinas + puntosLogros;

    // Obtener el rango mediante la puntuación
    let rango = 'Principiante';
    if (puntuacion >= 500 && puntuacion < 1000) {
        rango = 'Intermedio';
    } else if (puntuacion >= 1000 && puntuacion < 2000) {
        rango = 'Avanzado';
    } else if (puntuacion >= 2000) {
        rango = 'Experto';
    }

    return { puntuacion, rango };
}

module.exports = {
    obtenerResumenUsuario: async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;

            // Obtener datos del usuario
            const usuario = await Usuario.findOne({
                where: { idUsuario },
                attributes: ['username', 'fotoPerfil']
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const nombreUsuario = usuario.username;
            const fotoPerfil = `http://192.168.2.2:3000/uploads/usuarios/${usuario.fotoPerfil}`;

            // Obtener rango y puntuación
            const { puntuacion, rango } = await calcularRangoYPuntuacion(idUsuario);

            // Obtener el total de máquinas completadas
            const maquinasCompletadas = await Intenta.count({
                where: { idUsuario, estado: 'Completado' },
                distinct: true,
                col: 'idMaquina',
            });

            // Obtener el total de logros obtenidos
            const logrosCompletados = await UsuarioLogro.count({
                where: { idUsuario }
            });

            // Progreso
            const totalMaquinas = await Maquina.count();
            const totalLogros = await Logro.count();
            const totalPosibles = totalMaquinas + totalLogros;
            const totalCompletado = maquinasCompletadas + logrosCompletados;

            const progreso = totalPosibles > 0 ? Math.round((totalCompletado * 100) / totalPosibles) : 0;

            return res.status(200).json({ nombreUsuario, fotoPerfil, rango, progreso, puntuacion, maquinasCompletadas, logrosCompletados });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error - No se ha podido obtener el resumen del usuario' });
        }
    },
    obtenerInformacionUsuario: async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;

            // Obtener datos del usuario
            const usuario = await Usuario.findOne({
                attributes: [
                    'idUsuario',
                    'username',
                    [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/usuarios/', Sequelize.col('fotoPerfil')), 'fotoPerfil'],
                    'email',
                    'pais',
                    'fechaNacimiento',
                    'telefono',
                    'fechaRegistro'
                ],
                where: { idUsuario }
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener rango y puntuación
            const { puntuacion, rango } = await calcularRangoYPuntuacion(idUsuario);

            // Obtener la última máquina intentada
            const ultimaMaquina = await Intenta.findOne({
                where: { idUsuario },
                order: [['fechaFin', 'DESC']],
                include: [{
                    model: Maquina,
                    attributes: ['idMaquina', 'nombre']
                }]
            });

            return res.status(200).json({ usuario, rango, ultimaMaquina: ultimaMaquina?.Maquina || null });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error - No se ha podido obtener la información del usuario' });
        }
    },
    actualizarFotoPerfil: async (req, res) => {
        try {
            // Verificar que se haya subido un archivo y manda el error si no es un archivo formato correcto
            if (!req.file) {
                return res.status(400).json({ message: req.fileValidationError });
            }

            // Obtener el nombre del archivo subido
            const nombreArchivoNuevo = req.file.filename;

            // Obtener el id del usuario
            const idUsuario = req.user.idUsuario;
            if (!idUsuario) {
                return res.status(400).json({ message: 'No se ha encontrado el ID de usuario' });
            }

            // Obtener el usuario actual
            const usuario = await Usuario.findOne({ where: { idUsuario } });
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener el nombre de la foto anterior
            const nombreArchivoAnterior = usuario.fotoPerfil;

            // Verificar si la foto anterior es la foto predeterminada, para no borrarla
            if (nombreArchivoAnterior !== 'fotoPerfil.png') {

                const rutaArchivoAnterior = path.join(__dirname, '../uploads/usuarios', nombreArchivoAnterior);

                // Verificar si el archivo existe y eliminarlo
                if (fs.existsSync(rutaArchivoAnterior)) {
                    fs.unlinkSync(rutaArchivoAnterior);
                }
            }

            // Actualizar la foto de perfil en la base de datos
            const [filasActualizadas] = await Usuario.update(
                { fotoPerfil: nombreArchivoNuevo },
                { where: { idUsuario } }
            );

            if (filasActualizadas === 0) {
                return res.status(404).json({ message: 'No se realizó ningún cambio' });
            }

            res.status(200).json({ message: 'Foto de perfil actualizada correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error - No se ha podido actualizar la foto de perfil' });
        }
    },
    actualizarDatosUsuario: async (req, res) => {
        try {
            const { username, email, pais, fechaNacimiento, telefono } = req.body;
            const idUsuario = req.user.idUsuario;

            // Buscamos al usuario actual en la base de datos
            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Comprobamos si el nombre de usuario ya está en uso
            if (username && username !== usuario.username) {
                const usuarioExistente = await Usuario.findOne({ where: { username } });
                if (usuarioExistente) {
                    return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
                }
            }

            // Comprobamos si el email ya está en uso
            if (email && email !== usuario.email) {
                const emailExistente = await Usuario.findOne({ where: { email } });
                if (emailExistente) {
                    return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
                }
            }

            // Validamos el número de teléfono
            if (telefono) {
                const telefonoValido = /^(\+?\d{1,4})?[\s]?(?:\d[\s]?){6,14}\d$/;
                if (!telefonoValido.test(telefono)) {
                    return res.status(400).json({
                        message: 'Formato de teléfono no válido. Solo se permiten números y espacios opcionales. Ej: "612 345 678"'
                    });
                }
            }

            // Actualizamos los datos del usuario
            const [filasActualizadas] = await Usuario.update(
                {
                    username: username || usuario.username,
                    email: email || usuario.email,
                    pais: pais || usuario.pais,
                    fechaNacimiento: fechaNacimiento || usuario.fechaNacimiento,
                    telefono: telefono || usuario.telefono
                },
                {
                    where: { idUsuario },
                }
            );

            if (filasActualizadas === 0) {
                return res.status(404).json({ message: 'No se han realizado cambios en el usuario' });
            }

            res.status(200).json({ message: 'Datos actualizados correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'No se ha podido actualizar los datos del usuario' });
        }
    },
    actualizarPassword: async (req, res) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        try {
            const { contrasenaActual, nuevaPassword, confirmarPassword } = req.body;
            const idUsuario = req.user.idUsuario;

            // Comprobamos que el usuario existe
            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Validaciones Campos
            if (!contrasenaActual || !nuevaPassword || !confirmarPassword) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Comparar la contraseña actual con la que tiene en la base de datos
            const match = await bcrypt.compare(contrasenaActual, usuario.password);
            if (!match) {
                return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
            }

            // Verificar que la nueva contraseña no sea igual a la actual
            if (contrasenaActual === nuevaPassword) {
                return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la contraseña actual' });
            }

            // Comprobamos que las contraseñas nuevas coinciden
            if (nuevaPassword !== confirmarPassword) {
                return res.status(400).json({ message: 'Las nuevas contraseñas no coinciden' });
            }

            // Verificamos que la contraseña nueva sea segura
            if (!passwordRegex.test(nuevaPassword)) {
                return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número' });
            }

            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

            // Actualizar la contraseña
            const [filasActualizadas] = await Usuario.update(
                { password: hashedPassword },
                { where: { idUsuario } }
            );

            // Verificar si la actualización se realizó correctamente
            if (filasActualizadas === 0) {
                return res.status(400).json({ message: 'No se pudo actualizar la contraseña' });
            }

            return res.status(200).json({ message: 'Contraseña actualizada con éxito' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar la contraseña' });
        }
    },
    obtenerRanking: async (req, res) => {
        const idUsuario = req.user.idUsuario;

        try {
            // Obtener todos los usuarios
            const usuarios = await Usuario.findAll({
                attributes: ['idUsuario', 'username', 'fotoPerfil']
            });

            const ranking = [];

            // Obtener todos los datos de cada usuario
            for (const usuario of usuarios) {
                const idUsuario = usuario.idUsuario;

                // Calcular puntuación
                const { puntuacion } = await calcularRangoYPuntuacion(idUsuario);

                // Obtener máquinas completadas
                const maquinasCompletadas = await Intenta.count({
                    where: { idUsuario, estado: 'Completado' },
                    distinct: true,
                    col: 'idMaquina',
                });

                // Obtener logros completados
                const logrosCompletados = await UsuarioLogro.count({
                    where: { idUsuario }
                });

                // Añadir usuario con sus datos
                ranking.push({
                    idUsuario,
                    username: usuario.username,
                    fotoPerfil: `http://192.168.2.2:3000/uploads/usuarios/${usuario.fotoPerfil}`,
                    maquinasCompletadas,
                    logrosCompletados,
                    puntuacion
                });
            }

            // Ordenar por puntuación
            ranking.sort((a, b) => b.puntuacion - a.puntuacion);

            // Obtener posición del usuario actual
            const posicionUsuario = ranking.findIndex(u => u.idUsuario === idUsuario) + 1;

            // Obtener los datos del usuario actual en el ranking
            const usuarioActual = ranking.find(u => u.idUsuario === idUsuario);

            return res.status(200).json({
                miRanking: { posicion: posicionUsuario, ...usuarioActual }, ranking: ranking.map((usuario, index) => ({
                    posicion: index + 1,
                    username: usuario.username,
                    fotoPerfil: usuario.fotoPerfil,
                    maquinasCompletadas: usuario.maquinasCompletadas,
                    logrosCompletados: usuario.logrosCompletados,
                    puntuacion: usuario.puntuacion
                }))
            });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el ranking de usuarios' });
        }
    },
    obtenerUsuariosRegistrados: async (req, res) => {
        const rol = req.user.rol;

        // Comprobamos que el rol del usuario sea Administrador
        if (rol !== 'Administrador') {
            return res.status(403).json({ message: 'No tienes permiso para acceder a esta información' });
        }

        try {

            // Obtenemos todos los usuarios registrados con sus datos
            const usuariosRegistrados = await Usuario.findAll({
                attributes: [
                    'idUsuario',
                    'username',
                    [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/usuarios/', Sequelize.col('fotoPerfil')), 'fotoPerfil'],
                    'email',
                    'pais',
                    'telefono',
                    'rol',
                    'fechaRegistro'
                ],
            });

            res.status(200).json({ usuariosRegistrados });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios registrados'});
        }

    }
}