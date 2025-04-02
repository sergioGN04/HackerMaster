const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acceso no autorizado. No se proporcionó un token.' });

    jwt.verify(token, process.env.SECRET_KEY, (err, datos) => {
        if (err) return res.status(403).json({ message: 'Token inválido o expirado' });

        req.user = datos;
        next();
    });
};

module.exports = verifyToken;