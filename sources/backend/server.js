const fs = require('fs');
const path = require('path');
const app = require('./app');
const PORT = process.env.PORT || 3000;

// Configuración de HTTPS en el servidor
const https = require('https');

const sslKey = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'));
const sslCert = fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert'));

https.createServer({ key: sslKey, cert: sslCert }, app).listen(PORT, () => {
    console.log(`Se ha iniciado correctamente. Ejemplo: https://${process.env.IP_BACKEND}/api/estadisticas-actuales`);
});