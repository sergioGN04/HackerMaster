const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Error - No se proporcionó un token.' });

    jwt.verify(token, process.env.SECRET_KEY, (error, datos) => {
        if (error) return res.status(403).json({ message: 'Error - Token inválido o expirado' });

        req.user = datos;
        next();
    });
};

module.exports = verifyToken;