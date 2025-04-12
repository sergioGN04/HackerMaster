const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta absoluta para el directorio de uploads
const uploadDir = path.resolve(__dirname, '../uploads/usuarios');

// Verificar si el directorio existe, si no, crearlo
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Renombrar el archivo para evitar colisiones (agregar fecha y nombre original)
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

// Filtrar el tipo de archivo permitido (PNG, JPG, JPEG)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    req.fileValidationError = 'El archivo debe ser una imagen JPG, JPEG o PNG';
    cb(null, false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload.single('fotoPerfil');