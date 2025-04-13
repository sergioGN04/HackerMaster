const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Rutas para los directorios
const uploadDirContenedores = path.resolve(__dirname, '../uploads/maquinas/contenedores');
const uploadDirImagenes = path.resolve(__dirname, '../uploads/maquinas/imagenes');

// Crear los directorios si no existen
if (!fs.existsSync(uploadDirContenedores)) {
    fs.mkdirSync(uploadDirContenedores, { recursive: true });
}
if (!fs.existsSync(uploadDirImagenes)) {
    fs.mkdirSync(uploadDirImagenes, { recursive: true });
}

// Configuración del almacenamiento, según el fichero distinta ruta
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'fotoMaquina') {
            cb(null, uploadDirImagenes);
        } else if (file.fieldname === 'imagenMaquina') {
            cb(null, uploadDirContenedores);
        } else {
            cb(new Error('Campo de archivo no reconocido'), null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

// Filtro por el formato del archivo
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'fotoMaquina') {
        const valid = /jpeg|jpg|png/.test(file.mimetype);
        if (!valid) {
            req.fileValidationError = 'La foto debe ser una imagen JPG, JPEG o PNG';
            return cb(null, false);
        }
        return cb(null, true);
    }

    if (file.fieldname === 'imagenMaquina') {
        const valid = /tar/.test(file.mimetype);
        if (!valid) {
            req.fileValidationError = 'El archivo debe ser un .tar';
            return cb(null, false);
        }
        return cb(null, true);
    }

    return cb(null, false);
};

// Configuración completa del Multer
const uploadMaquina = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024 // 2GB
    }
}).fields([
    { name: 'fotoMaquina', maxCount: 1 },
    { name: 'imagenMaquina', maxCount: 1 }
]);

module.exports = uploadMaquina;