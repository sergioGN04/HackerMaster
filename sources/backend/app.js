const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
// Archivo para guardar los logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(body_parser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: '*',
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

// Para proteger contra ataques XSS en HTTPS
//app.use(
//    helmet.hsts({
//        maxAge: 63072000, // 2 años en segundos
//        includeSubDomains: true,
//        preload: true,
//    })
//);

const sequelize = require('./config/database');

sequelize.authenticate()
    .then(() => { console.log("Se ha conectado a la base de datos correctamente"); })
    .catch((error) => { console.error("Error - No se ha podido conectar a la base de datos", error); });

sequelize.sync({ alter: true })
    .then(() => console.log('Se han creado las tablas correctamente'))
    .catch(() => console.error('Error - No se ha podido crear las tablas correctamente'));

const academiaRoutes = require('./routes/academiaRoutes');
app.use(academiaRoutes);

app.listen(PORT, () => {
    console.log(`Se ha iniciado correctamente. Ejemplo: http://192.168.1.2:${PORT}/api/estadisticas-actuales`);
});