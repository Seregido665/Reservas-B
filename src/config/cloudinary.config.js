const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

// CLUDINARY → Servicio en la nube para almacenar, transformar y mostrar imágenes y vídeos.
// MULTER → Middleware de Express para recibir archivos (imágenes, vídeos) desde formularios.
// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del storage de Multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "books", 
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Middleware de Multer
const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload,
};
