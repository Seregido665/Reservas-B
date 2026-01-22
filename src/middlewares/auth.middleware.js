const { verifyToken } = require("../config/jwt.config");
const UserModel = require("../models/User.model");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token de acceso requerido" });
    }

    // Verificar el token
    const decoded = verifyToken(token);
    console.log("💡 Middleware auth ejecutado, userId:", decoded.userId); // ✅ Ahora sí existe

    // Buscar el usuario en la base de datos
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    console.log("✅ Usuario autenticado:", req.user._id); // Debug
    next();
    
  } catch (error) {
    console.error("❌ Error en authenticateToken:", error); // Debug
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    } else {
      return res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acceso denegado. Se requieren permisos de administrador",
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
};