// AL CREAR EL PROYECTO --> npm instal PARA INSTALAR node_modules Y ACTUALIZAR package-lock.json

//  npm install express      --> Framework para crear servidores y APIs de manera sencilla y rápida.
//  npm install dotenv       --> Permite crear un .env
//  npm install mongoose     --> Para conectarme con MongoDB   (ESCRIBIR mongosh para comprobar que este instalado)
//  npm install cors         --> Hace que la API sea accesibles desde otros dominios. 
//  npm install bcryptjs     --> Para encriptar contraseñas
//  npm install -D nodemon   --> Actualiza el localhost ante cualquier cambio.
// --> npm run dev 



require("dotenv").config();                                                                     
const express = require("express");          
const app = express();

      // --- CONFIGURACIÓN CORS ---
const cors = require("cors");
app.use(cors()); // <-- Aquí lo añadimos

app.use(express.json()); // middleware para parsear JSON

      // --- CONEXION A LA BASE DE DATOS DE MongoDB:  ->  mongo.config.js  <---
require("./config/mongo.config");

      // --- IMPORTA EL ARCHIVO  ->  routes.config  <-  CON TODAS LAS CONSULTAS ---
const router = require("./config/routes.config");
app.use("/", router);

      // -- CONSULTA EL PORT (3000) DE .env, Y POR SI TARDA APARECE UN MENSAJE. --
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
