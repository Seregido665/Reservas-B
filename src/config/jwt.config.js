// --- GENERACION Y VERIFICACION DE TOKENS ---
const jwt = require("jsonwebtoken");

// COMO NO HABRA EN EL .env SE PONDRAN POR DEFECTO LOS " "
const JWT_SECRET = process.env.JWT_SECRET || "secreto_jwt_super_seguro";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Generar 
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
// Verificar 
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
