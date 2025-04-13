const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');
const Usuario = require('../models/usuarioModel');
const path = require('path');
const fs = require('fs').promises;

// Eliminar los archivos subidos en caso de error
const eliminarArchivosSubidos = async (req) => {
    const contenedorDir = path.resolve(__dirname, '../uploads/maquinas/contenedores');
    const imagenesDir = path.resolve(__dirname, '../uploads/maquinas/imagenes');

    try {
        if (req.files) {
            const archivos = ['fotoMaquina', 'imagenMaquina'];
            for (const campo of archivos) {
                if (req.files[campo]) {
                    for (const archivo of req.files[campo]) {
                        let rutaOriginal;

                        // Determinamos la ruta según el tipo de archivo
                        if (campo === 'fotoMaquina') {
                            rutaOriginal = path.join(imagenesDir, archivo.filename);
                        } else if (campo === 'imagenMaquina') {
                            rutaOriginal = path.join(contenedorDir, archivo.filename);
                        }

                        // Intentamos eliminar el archivo original
                        await fs.unlink(rutaOriginal).catch(async (err) => {
                            if (err.code === 'ENOENT' && campo === 'imagenMaquina' && req.body?.nombre) {
                                // Si el archivo no se encuentra, intentamos con el renombrado
                                const rutaRenombrada = path.join(contenedorDir, `${req.body.nombre}.tar`);
                                await fs.unlink(rutaRenombrada);
                            } else {
                                throw err;
                            }
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error - No se ha podido eliminar los archivos: ', err.message);
    }
};

module.exports = {
    obtenerMaquinasRecomendadas: async (req, res) => {
        const { rango } = req.query;

        const idUsuario = req.user.idUsuario;

        // Obtenemos la dificultad según el rango
        let dificultad = 'Facil';
        if (rango === 'Intermedio' || rango === 'Avanzado') {
            dificultad = 'Medio';
        } else if (rango === 'Experto') {
            dificultad = 'Dificil';
        }

        try {
            // Obtenemos las máquinas que el usuario ya ha intentado
            const maquinasIntentadas = await Intenta.findAll({
                where: {
                    idUsuario
                },
                attributes: ['idMaquina']
            });

            // Creamos un array con los IDs de las máquinas intentadas
            const maquinasExcluidas = maquinasIntentadas.map(m => m.idMaquina);

            // Obtenemos las máquinas recomendadas según la dificultad y excluyendo las ya intentadas
            const maquinasRecomendadas = await Maquina.findAll({
                attributes: [
                    'idMaquina',
                    'nombre',
                    [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/maquinas/imagenes/', Sequelize.col('fotoMaquina')), 'fotoMaquina'],
                    'dificultad'
                ],
                where: {
                    dificultad,
                    estado: 'Aceptada',
                    idMaquina: {
                        [Op.notIn]: maquinasExcluidas
                    }
                },
                limit: 5
            });

            // Si no se encuentran máquinas recomendadas, respondemos con un mensaje de error
            if (maquinasRecomendadas.length === 0) {
                return res.status(404).json({ message: 'No se encontraron máquinas recomendadas.' });
            }

            return res.status(200).json(maquinasRecomendadas);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error - No se ha podido obtener las máquinas recomendadas' });
        }
    },
    obtenerMaquinasEnProgreso: async (req, res) => {
        const idUsuario = req.user.idUsuario;

        try {
            // Obtenemos los IDs de las máquinas que están en progreso
            const intentosEnProgreso = await Intenta.findAll({
                where: {
                    idUsuario,
                    estado: 'En Progreso'
                },
                attributes: ['idMaquina']
            });

            const idsMaquinasEnProgreso = intentosEnProgreso.map(i => i.idMaquina);

            if (idsMaquinasEnProgreso.length === 0) {
                return res.status(404).json({ message: 'No hay máquinas en progreso.' });
            }

            // Obtenemos las máquinas que tienen el estado "Completado" con los mismos IDs
            const intentosCompletados = await Intenta.findAll({
                where: {
                    idUsuario,
                    estado: 'Completado',
                    idMaquina: {
                        [Op.in]: idsMaquinasEnProgreso
                    }
                },
                attributes: ['idMaquina']
            });

            // Obtenemos los IDs de las máquinas completadas
            const idsMaquinasCompletadas = intentosCompletados.map(i => i.idMaquina);

            // Filtramos las máquinas en progreso para eliminar las que están completadas
            const maquinasEnProgreso = idsMaquinasEnProgreso.filter(id => !idsMaquinasCompletadas.includes(id));

            if (maquinasEnProgreso.length === 0) {
                return res.status(404).json({ message: 'No hay máquinas en progreso sin completar.' });
            }

            // Obtenemos las máquinas que están en progreso y no están completadas
            const maquinas = await Maquina.findAll({
                attributes: [
                    'idMaquina',
                    'nombre',
                    [
                        Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/maquinas/imagenes/', Sequelize.col('fotoMaquina')),
                        'fotoMaquina'
                    ],
                    'dificultad'
                ],
                where: {
                    idMaquina: {
                        [Op.in]: maquinasEnProgreso
                    }
                }
            });

            return res.status(200).json(maquinas);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error - No se ha podido obtener las máquinas en progreso' });
        }
    },
    obtenerMaquinasFiltradas: async (req, res) => {
        try {
            const { nombreMaquina } = req.query;

            // Obtenemos las máquinas aceptadas, filtradas por el nombre
            const maquinasFiltradas = await Maquina.findAll({
                attributes: [
                    'idMaquina',
                    'nombre',
                    [
                        Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/maquinas/imagenes/', Sequelize.col('fotoMaquina')),
                        'fotoMaquina'
                    ],
                    'dificultad'
                ],
                where: {
                    nombre: {
                        [Op.like]: `%${nombreMaquina}%`
                    },
                    estado: 'Aceptada'
                }
            });

            res.status(200).json({ maquinasFiltradas })

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las máquinas' });
        }
    },
    crearMaquina: async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;

            // Verificar si hubo errores en la validación de archivos y en los tamaños de los archivos
            if (req.fileValidationError) {
                await eliminarArchivosSubidos(req);
                return res.status(400).json({ message: req.fileValidationError });
            }

            if (req.files.fotoMaquina?.[0]?.size > 5 * 1024 * 1024) {
                await eliminarArchivosSubidos(req);
                return res.status(400).json({ message: 'La foto no puede superar los 5MB' });
            }
            
            if (req.files.imagenMaquina?.[0]?.size > 2 * 1024 * 1024 * 1024) {
                await eliminarArchivosSubidos(req);
                return res.status(400).json({ message: 'La imágen no puede superar los 2GB' });
            }

            const { nombre, dificultad, writeUp, flagUsuario, flagRoot, puntuacion, descripcion } = req.body;

            // Validar campos obligatorios
            if (!nombre || !dificultad || !writeUp || !flagUsuario || !flagRoot || !puntuacion || !descripcion) {
                await eliminarArchivosSubidos(req);
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Verificar si el nombre de la máquina ya existe
            const existeMaquina = await Maquina.findOne({ where: { nombre } });
            if (existeMaquina) {
                await eliminarArchivosSubidos(req);
                return res.status(409).json({ message: 'Ya existe una máquina con ese nombre' });
            }

            // Verificar si el usuario existe
            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) {
                await eliminarArchivosSubidos(req);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener nombres de los archivos subidos
            const fotoMaquina = req.files['fotoMaquina'] ? req.files['fotoMaquina'][0].filename : null;
            const imagenMaquinaTemp = req.files['imagenMaquina'] ? req.files['imagenMaquina'][0].filename : null;

            // Renombrar archivo .tar con el nombre de la máquina
            if (imagenMaquinaTemp) {
                const contenedorDir = path.resolve(__dirname, '../uploads/maquinas/contenedores');
                const rutaVieja = path.join(contenedorDir, imagenMaquinaTemp);
                const rutaNueva = path.join(contenedorDir, `${nombre}.tar`);
                fs.rename(rutaVieja, rutaNueva);
            }

            // Crear la nueva máquina en la base de datos
            await Maquina.create({
                nombre,
                idUsuario,
                fotoMaquina: fotoMaquina,
                dificultad,
                puntuacion,
                descripcion,
                writeUp,
                flagUsuario,
                flagRoot,
                estado: 'En Espera',
            });

            return res.status(201).json({ message: 'Máquina subida correctamente' });

        } catch (error) {
            await eliminarArchivosSubidos(req);
            console.error(error);
            res.status(500).json({ message: 'Error al crear la máquina' });
        }
    }

}