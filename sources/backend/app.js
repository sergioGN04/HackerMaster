const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Permite el uso de variables de entorno
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' }); // Archivo para guardar los logs
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(body_parser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de CORS para permitir el acceso al frontend
app.use(cors({
    origin: `https://${process.env.IP_FRONTEND}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para tener un registro de las peticiones
app.use(morgan('common', { stream: accessLogStream }));

// Middleware para proteger la aplicación contra ataques de tipo XSS
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", 'https:'],
            imgSrc: ["'self'", 'data:'],
        },
    })
);

// Middleware para forzar el uso de HTTPS
app.use(
    helmet.hsts({
        maxAge: 63072000, // 2 años
        includeSubDomains: true,
        preload: true,
    })
);

// Middleware para limitar el número de peticiones, evita DDoS y ataques de fuerza bruta
// Envia un error 429 si se supera el límite para que el frontend lo gestione
const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 300,
    statusCode: 429,
    message: JSON.stringify({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: 300 // 5 minutos
    }),
    standardHeaders: true,
    legacyHeaders: false
});

app.use(globalLimiter);

// Conexión a la base de datos y creación de tablas
const sequelize = require('./config/database');
sequelize.authenticate()
    .then(() => { console.log("Se ha conectado a la base de datos correctamente"); })
    .catch((error) => { console.error("Error - No se ha podido conectar a la base de datos", error); });

sequelize.sync({ alter: true })
    .then(() => console.log('Se han creado las tablas correctamente'))
    .catch(() => console.error('Error - No se ha podido crear las tablas correctamente'));

// Rutas de la API
const academiaRoutes = require('./routes/academiaRoutes');
app.use(academiaRoutes);

// Configuración de HTTPS en el servidor
const https = require('https');

const sslKey = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'));
const sslCert = fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert'));

https.createServer({ key: sslKey, cert: sslCert }, app).listen(PORT, () => {
    console.log(`Se ha iniciado correctamente. Ejemplo: https://${process.env.IP_BACKEND}/api/estadisticas-actuales`);
});