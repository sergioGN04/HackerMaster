const { Sequelize, Op } = require('sequelize');
const Logro = require('../models/logroModel');
const UsuarioLogro = require('../models/usuarioLogroModel');

module.exports = {
    obtenerLogrosUsuario: async (req, res) => {
        try {
            const { idUsuario } = req.query;

            if (!idUsuario) {
                return res.status(400).json({ message: "El idUsuario es requerido" });
            }
    
            // Buscar los idLogro del usuario en la tabla UsuarioLogro
            const usuarioLogros = await UsuarioLogro.findAll({
                where: { idUsuario },
                attributes: ['idLogro']
            });

            // Si el usuario no tiene logros devolver un array vacío
            if (usuarioLogros.length === 0) {
                return res.status(200).json({ logros: [] });
            }

            const idsLogros = usuarioLogros.map(logro => logro.idLogro);
    
            // Buscar los logros relacionados con los idLogro encontrados
            const logros = await Logro.findAll({
                attributes: [
                    'idLogro', 
                    'nombre', 
                    'descripcion', 
                    [ Sequelize.fn('CONCAT', `http://${process.env.IP_BACKEND}/uploads/logros/`, Sequelize.col('fotoLogro')),'fotoLogro' ],
                    'puntuacion'
                ],
                where: {
                    idLogro: {
                        [Op.in]: idsLogros
                    }
                }
            });

            // Si no se encuentran logros devolver un array vacío
            if (logros.length === 0) {
                return res.status(200).json({ logros: [] });
            }
    
            // Devolver los logros con el estado de éxito
            return res.status(200).json({ logros });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error - No se han podido obtener los logros" });
        }
    }
}