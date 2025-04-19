const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');
const Usuario = require('../models/usuarioModel');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

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
                        await fsp.unlink(rutaOriginal).catch(async (err) => {
                            if (err.code === 'ENOENT' && campo === 'imagenMaquina' && req.body?.nombre) {
                                // Si el archivo no se encuentra, intentamos con el renombrado
                                const rutaRenombrada = path.join(contenedorDir, `${req.body.nombre}.tar`);
                                await fsp.unlink(rutaRenombrada);
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

// Timeout para detener automáticamente la máquina
const detenerAutomaticamente = (nombre) => {
    setTimeout(async () => {
        try {
            const contenedor = docker.getContainer(nombre);
            const info = await contenedor.inspect();

            if (info.State.Running) {
                await contenedor.stop({ t: 5 });
                await contenedor.remove();

                console.log(`Contenedor ${nombre} detenido automáticamente después de 3 horas.`);

                // Extraer nombre de la máquina y del usuario
                const [nombreMaquina, username] = nombre.split('-');

                // Buscar máquina y usuario para cerrar el intento
                const maquina = await Maquina.findOne({ where: { nombre: nombreMaquina } });
                const usuario = await Usuario.findOne({ where: { username } });

                if (maquina && usuario) {
                    await Intenta.update(
                        { fechaFin: new Date() },
                        {
                            where: {
                                idUsuario: usuario.idUsuario,
                                idMaquina: maquina.idMaquina,
                                fechaFin: null
                            }
                        }
                    );

                    console.log(`Intento cerrado automáticamente para ${username} en la máquina ${nombreMaquina}.`);
                }

            }
        } catch (error) {
            console.error(`Error al detener automáticamente el contenedor ${nombre}:`, error.message);
        }
    }, 10800000); // 3 horas
};

// Crear imagen Docker a partir del archivo .tar
const crearImagenDocker = async (nombreMaquina) => {
    const tarPath = path.resolve(__dirname, `../uploads/maquinas/contenedores/${nombreMaquina}.tar`);

    try {
        // Leemos el archivo .tar
        const tarStream = fs.createReadStream(tarPath);

        // Cargar la imagen Docker desde el archivo .tar
        await docker.loadImage(tarStream);

        console.log(`Imagen Docker cargada correctamente: ${nombreMaquina}`);

        return { success: true, message: 'Imagen cargada correctamente' };

    } catch (error) {
        console.error('Error al cargar la imagen Docker:', error);
        throw new Error('Error al cargar la imagen Docker');
    }
};

// Función para eliminar los archivos de una máquina
const eliminarArchivosMaquina = async (maquina) => {
    const contenedorDir = path.resolve(__dirname, '../uploads/maquinas/contenedores');
    const imagenesDir = path.resolve(__dirname, '../uploads/maquinas/imagenes');
    const imagenPorDefecto = 'fotoMaquina.png';

    try {
        // Eliminar imagen .tar
        if (maquina.nombre) {
            // Obtener nombre de la imagen
            const nombreImagen = `${maquina.nombre}.tar`;

            const rutaTar = path.join(contenedorDir, nombreImagen);
            await fsp.unlink(rutaTar).catch(() => console.error(`No se encontró ${rutaTar}`));
        }

        // Eliminar imagen de la máquina, si no es la imagen por defecto
        if (maquina.fotoMaquina && maquina.fotoMaquina !== imagenPorDefecto) {
            const rutaFoto = path.join(imagenesDir, maquina.fotoMaquina);
            await fsp.unlink(rutaFoto).catch(() => console.error(`No se encontró ${rutaFoto}`));
        }

    } catch (err) {
        console.error('Error al eliminar archivos:', err.message);
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
                fsp.rename(rutaVieja, rutaNueva);
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
    },
    obtenerDetallesMaquina: async (req, res) => {
        const idMaquina = req.query.idMaquina;
        const username = req.user.username;

        // Verificar que se ha proporcionado el idMaquina
        if (!idMaquina) {
            return res.status(400).json({ message: 'Fallo al obtener el idMaquina' });
        }

        try {
            // Obtener los detalles de la máquina
            const maquina = await Maquina.findOne({
                attributes: [
                    'idMaquina',
                    [
                        Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/maquinas/imagenes/', Sequelize.col('fotoMaquina')),
                        'fotoMaquina'
                    ],
                    'nombre',
                    'dificultad',
                    'descripcion',
                    'writeUp',
                    'puntuacion',
                    'fechaCreacion'
                ],
                include: [{
                    model: Usuario,
                    attributes: ['username']
                }],
                where: { idMaquina }
            });

            // Verificar que se ha obtenido los detalles de la máquina correctamente
            if (!maquina) {
                return res.status(404).json({ message: 'Máquina no encontrada' });
            }

            // Obtener la IP si la máquina ya está desplegada
            const nombreContenedor = `${maquina.nombre}-${username}`;
            let ip = null;
            try {
                const contenedor = docker.getContainer(nombreContenedor);
                const infoContenedor = await contenedor.inspect();

                if (infoContenedor.State.Running) {
                    ip = infoContenedor.NetworkSettings.Networks['hackermaster_red_maquinas'].IPAddress;
                }

            } catch (error) {
                // No hay ningún contenedor desplegado
            }

            res.status(200).json({ maquina, ip });

        } catch (error) {
            res.status(500).json({ message: 'Error del servidor' });
        }
    },
    desplegarMaquina: async (req, res) => {
        const { idMaquina } = req.body;
        const username = req.user.username;

        try {
            // Obtener la máquina
            const maquina = await Maquina.findOne({ where: { idMaquina } });
            if (!maquina) {
                return res.status(400).json({ message: 'Error al obtener la máquina' });
            }

            // Nombre único para el contenedor
            const nombreImagen = maquina.nombre.toLowerCase();
            const nombreContenedor = `${maquina.nombre}-${username}`;

            // Verificar si el contenedor ya existe y está corriendo
            const contenedorExistente = docker.getContainer(nombreContenedor);
            try {
                const infoContenedor = await contenedorExistente.inspect();
                if (infoContenedor.State.Running) {
                    const ip = infoContenedor.NetworkSettings.Networks.hackermaster_red_maquinas.IPAddress;
                    return res.status(200).json({ ip });
                }
            } catch (error) {
                // El contenedor no existe, se crea uno nuevo
            }

            // Creación del contenedor
            const contenedor = await docker.createContainer({
                Image: nombreImagen,
                name: nombreContenedor,
                HostConfig: {
                    NetworkMode: 'hackermaster_red_maquinas',
                },
            });

            // Comprobar si ya hay un intento para esta máquina
            let intento = await Intenta.findOne({
                where: {
                    idMaquina,
                    idUsuario: req.user.idUsuario,
                    fechaFin: null
                }
            });

            // Si no hay intento, creamos un nuevo intento
            if (!intento) {
                intento = await Intenta.create({
                    idUsuario: req.user.idUsuario,
                    idMaquina,
                    fechaInicio: new Date(),
                    estado: 'En Progreso',
                    fechaFin: null
                });
            }

            // Iniciar el contenedor
            await contenedor.start();

            // Obtener información del contenedor
            const info = await contenedor.inspect();
            const ip = info.NetworkSettings.Networks.hackermaster_red_maquinas.IPAddress;

            // Añadir tiempo de vida al contenedor (detención automática)
            detenerAutomaticamente(nombreContenedor);

            return res.status(200).json({ ip });

        } catch (error) {
            console.error('ERROR desplegarMaquina:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },
    detenerMaquina: async (req, res) => {
        const { idMaquina } = req.body;
        const username = req.user.username;

        try {
            // Obtener la máquina
            const maquina = await Maquina.findOne({ where: { idMaquina } });
            if (!maquina) {
                return res.status(400).json({ message: 'Error al obtener la máquina' });
            }

            // Nombre del contenedor
            const nombreContenedor = `${maquina.nombre}-${username}`;

            // Obtener el contenedor por nombre
            const contenedor = docker.getContainer(nombreContenedor);

            // Verificar si el contenedor existe y está corriendo
            const info = await contenedor.inspect();
            if (info.State.Running) {
                await contenedor.stop({ t: 5 });
            }

            // Eliminar el contenedor
            await contenedor.remove();

            // Cerrar el intento
            await Intenta.update(
                { fechaFin: new Date() },
                {
                    where: {
                        idUsuario: req.user.idUsuario,
                        idMaquina,
                        fechaFin: null
                    }
                }
            );

            return res.status(200).json({ success: true });

        } catch (error) {
            res.status(500).json({ message: 'Error al detener la máquina' });
        }
    },
    verificarMaquina: async (req, res) => {
        const { idMaquina, flagUsuario, flagRoot } = req.body;
        const username = req.user.username;

        if (!idMaquina) {
            return res.status(400).json({ message: 'Falta el idMaquina' });
        }

        try {
            // Buscar la máquina
            const maquina = await Maquina.findByPk(idMaquina);
            if (!maquina) {
                return res.status(404).json({ message: 'Máquina no encontrada' });
            }

            // Verificar si el contenedor está desplegado
            const nombreContenedor = `${maquina.nombre}-${username}`;
            const contenedor = docker.getContainer(nombreContenedor);

            let estaCorriendo = false;
            try {
                const info = await contenedor.inspect();
                estaCorriendo = info?.State?.Running || false;
            } catch (error) {
                estaCorriendo = false;
            }

            if (!estaCorriendo) {
                return res.status(400).json({ message: 'La máquina no está desplegada' });
            }

            // Buscar el intento, ya que se va a tener que desplegar la máquina (creará un intento nuevo), el intento será el más reciente
            const intento = await Intenta.findOne({
                where: {
                    idUsuario: req.user.idUsuario,
                    idMaquina,
                },
                order: [['fechaInicio', 'DESC']]
            });

            // Si no existe el intento
            if (!intento) {
                return res.status(400).json({ message: 'No hay un intento para esta máquina' });
            }

            // Verificaciones de las flags
            const flagsIncorrectas = [];
            const flagsCorrectas = [];

            if (typeof flagUsuario !== 'undefined') {
                if (flagUsuario === maquina.flagUsuario) {
                    flagsCorrectas.push('usuario');
                } else {
                    flagsIncorrectas.push('usuario');
                }
            }

            if (typeof flagRoot !== 'undefined') {
                if (flagRoot === maquina.flagRoot) {
                    flagsCorrectas.push('root');
                } else {
                    flagsIncorrectas.push('root');
                }
            }

            // Si ambas flags son correctas
            if (flagsCorrectas.includes('usuario') && flagsCorrectas.includes('root')) {

                // Comprobar si ya completó la máquina en otro intento anterior
                const yaCompletado = await Intenta.findOne({
                    where: {
                        idUsuario: req.user.idUsuario,
                        idMaquina,
                        estado: 'Completado'
                    }
                });

                // Actualizar intento actual
                await Intenta.update(
                    {
                        estado: 'Completado',
                        fechaFin: new Date()
                    },
                    {
                        where: {
                            idIntento: intento.idIntento
                        }
                    }
                );

                if (yaCompletado) {
                    return res.status(200).json({ message: '¡Correcto! Ya habías completado esta máquina', puntosSumados: false });
                }

                return res.status(200).json({ message: 'Ambas flags son correctas', puntosSumados: true });
            }

            // Si alguna flag está incorrecta
            if (flagsIncorrectas.length === 2) {
                return res.status(401).json({ message: 'Ambas flags son incorrectas' });
            }

            if (flagsIncorrectas.length === 1) {
                return res.status(401).json({ message: `La flag de ${flagsIncorrectas[0]} es incorrecta` });
            }

            return res.status(200).json({ message: 'Una de las flags es correcta, pero falta la otra para completar la máquina', puntosSumados: false });

        } catch (error) {
            console.error('Error en verificarMaquina:', error);
            res.status(500).json({ message: 'Error del servidor al verificar la máquina' });
        }
    },
    obtenerSolicitudesMaquinas: async (req, res) => {
        const rol = req.user.rol;

        // Verificamos que sea un administrador
        if (rol !== 'Administrador') {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }

        try {
            // Obtenemos las máquinas con estado En Espera
            const maquinasInformacion = await Maquina.findAll({
                attributes: ['idMaquina', 'nombre', 'dificultad', 'puntuacion', 'flagUsuario', 'flagRoot'],
                include: [{
                    model: Usuario,
                    attributes: [
                        'username',
                        [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/usuarios/', Sequelize.col('Usuario.fotoPerfil')), 'fotoPerfil']
                    ]
                }],
                where: { estado: 'En Espera' },
                order: [['fechaCreacion', 'ASC']]
            });

            // Agregamos el número de solicitud a cada máquina
            const solicitudesMaquinas = maquinasInformacion.map((solicitud, index) => ({
                posicion: index + 1,
                ...solicitud.toJSON()
            }));

            res.status(200).json({ solicitudesMaquinas });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las solicitudes de máquinas' });
        }
    },
    obtenerMaquinasRegistradas: async (req, res) => {
        const rol = req.user.rol;

        // Verificamos que sea un administrador
        if (rol !== 'Administrador') {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }

        try {
            // Obtenemos las máquinas registradas, es decir, todas las máquinas que están en estado Aceptada
            const maquinasRegistradas = await Maquina.findAll({
                attributes: [
                    'idMaquina',
                    'nombre',
                    'dificultad',
                    'fechaCreacion',
                    'puntuacion'
                ],
                include: [{
                    model: Usuario,
                    attributes: [
                        'username',
                        [Sequelize.fn('CONCAT', 'http://192.168.2.2:3000/uploads/usuarios/', Sequelize.col('Usuario.fotoPerfil')), 'fotoPerfil']
                    ]
                }],
                where: { estado: 'Aceptada' },
                order: [['fechaCreacion', 'ASC']]
            });

            res.status(200).json({ maquinasRegistradas });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las máquinas registradas' });
        }
    },
    aceptarSolicitud: async (req, res) => {
        const rol = req.user.rol;
        const { idMaquina } = req.body;
    
        // Verificamos que sea un administrador
        if (rol !== 'Administrador') {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }
    
        try {
            // Verificamos si la máquina existe
            const maquina = await Maquina.findByPk(idMaquina);
            if (!maquina) {
                return res.status(404).json({ message: 'La máquina no existe' });
            }
    
            // Verificamos si la máquina ya está aceptada
            if (maquina.estado === 'Aceptada') {
                return res.status(400).json({ message: 'La máquina ya está aceptada' });
            }
    
            // Actualizamos el estado a "Aceptada"
            await Maquina.update(
                { estado: 'Aceptada' },
                { where: { idMaquina } }
            );

            res.status(200).json({ message: 'Solicitud de máquina aceptada correctamente' });
    
            // Creamos la imagen Docker en segundo plano
            (async () => {
                try {
                    const dockerResponse = await crearImagenDocker(maquina.nombre);
                    if (!dockerResponse.success) {
                        console.error(`Error al crear imagen Docker para ${maquina.nombre}:`, dockerResponse.message);
                    } else {
                        console.log(`Imagen Docker creada correctamente para ${maquina.nombre}`);
                    }
                } catch (err) {
                    console.error(`Error en creación de imagen Docker para ${maquina.nombre}:`, err.message);
                }
            })();
    
        } catch (error) {
            res.status(500).json({ message: 'Error al aceptar la solicitud de la máquina' });
        }
    },    
    denegarSolicitud: async (req, res) => {
        const rol = req.user.rol;
        const { idMaquina } = req.body;

        // Verificamos que el rol sea "Administrador"
        if (rol !== 'Administrador') {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }

        try {
            // Verificamos si la máquina existe
            const maquina = await Maquina.findByPk(idMaquina);
            if (!maquina) {
                return res.status(404).json({ message: 'La máquina no existe' });
            }

            // Eliminamos los archivos de la máquina
            await eliminarArchivosMaquina(maquina);

            // Eliminamos la máquina
            await Maquina.destroy({ where: { idMaquina } });

            res.status(200).json({ message: 'La solicitud de la máquina ha sido denegada y los archivos eliminados correctamente' });

        } catch (error) {
            res.status(500).json({ message: 'Error al denegar la solicitud de la máquina' });
        }
    },
    eliminarMaquina: async (req, res) => {
        const rol = req.user.rol;
        const { idMaquina } = req.query;
    
        // Verificamos que el rol sea "Administrador"
        if (rol !== 'Administrador') {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }
    
        try {
            // Verificamos si la máquina existe
            const maquina = await Maquina.findByPk(idMaquina);
            if (!maquina) {
                return res.status(404).json({ message: 'Máquina no encontrada' });
            }
    
            // Eliminamos la máquina
            await maquina.destroy();

            res.status(200).json({ message: 'Máquina eliminada correctamente' });
    
            // Eliminamos los archivos y contenedores asociados a la máquina, se hace en segundo plano
            (async () => {
                try {
                    // Eliminar archivos asociados
                    await eliminarArchivosMaquina(maquina);

                    // Obtener el nombre de la imagen
                    const nombreImagen = `${maquina.nombre.toLowerCase()}`;
    
                    // Buscar todos los contenedores usando esa imagen
                    const contenedores = await docker.listContainers({ all: true });
    
                    const contenedoresUsandoImagen = contenedores.filter(c => c.Image === nombreImagen);

                    // Detener y eliminar contenedores que usan la imagen
                    for (const contenedorInfo of contenedoresUsandoImagen) {
                        const contenedor = docker.getContainer(contenedorInfo.Id);

                        // Detener el contenedor
                        try {
                            await contenedor.stop();
                            console.log(`Contenedor ${contenedorInfo.Id} detenido correctamente.`);
                        } catch (error) {
                            console.error(`No se pudo detener contenedor ${contenedorInfo.Id}:`, error.message);
                        }

                        // Eliminar el contenedor
                        try {
                            await contenedor.remove();
                            console.log(`Contenedor ${contenedorInfo.Id} eliminado correctamente.`);
                        } catch (error) {
                            console.error(`No se pudo eliminar contenedor ${contenedorInfo.Id}:`, error.message);
                        }
                    }

                    // Eliminar la imagen Docker
                    try {
                        const imagen = docker.getImage(nombreImagen);
                        await imagen.remove();
                        console.log(`Imagen Docker ${nombreImagen} eliminada correctamente.`);
                    } catch (error) {
                        console.error(`No se pudo eliminar la imagen Docker ${nombreImagen}:`, error.message);
                    }
    
                } catch (error) {
                    console.error('Error al procesar archivos/contenedores:', error.message);
                }
            })();
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al eliminar la máquina' });
        }
    }

}