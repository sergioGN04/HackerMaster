const multer = require('multer');
const path = require('path');

// Ruta absoluta para el directorio de uploads
const uploadDir = path.resolve(__dirname, '../uploads/notificaciones');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Renombrar el archivo para evitar colisiones (agregar fecha y nombre original)
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no válido (solo jpg, jpeg, png)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload.single('fotoNotificacion');