const sequelize = require('../config/database');
const { Op } = require('sequelize');
const Maquina = require('../models/maquinaModel');
const Intenta = require('../models/IntentaModel');

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
                attributes: ['idMaquina', 'nombre', 'fotoMaquina', 'dificultad'],
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
                where: {
                    idMaquina: {
                        [Op.in]: maquinasEnProgreso
                    }
                },
                attributes: ['idMaquina', 'nombre', 'fotoMaquina', 'dificultad']
            });
    
            return res.status(200).json(maquinas);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error - No se ha podido obtener las máquinas en progreso' });
        }
    }    

}