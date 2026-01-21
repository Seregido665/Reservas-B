const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt.config");

// -- REGISTRAR UN USUARIO --
//    try - catch CON async - await PARA RESPETAR EL ORDEN DE LAS OPERACIONES
const register = async (req, res) => {
  
  console.log("📌 register controller llamado");
  console.log("Body recibido:", req.body);
  try {
    const newUser = req.body;

    // 1.- Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // 2.- Crear el nuevo usuario (la contraseña se hasheará automáticamente en el pre-save hook)
    const user = await UserModel.create(newUser);

    // 3.- Generar JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    // -- USUARIO NUEVO --
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({
      message: "Usuario creado correctamente",
      token,
      user: userResponse,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear el usuario", error: err.message });
  }
};

// -- LOGUEO DE USUARIO --
//    try - catch CON async - await PARA RESPETAR EL ORDEN DE LAS OPERACIONES
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1.- Validar que se envíen email y contraseña
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    // 2.- Buscar el usuario por email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // 3.- Verificar la contraseña
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // 4.- Generar JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    // -- SI SE LOGUEO CORRECTAMENTE --
    const userLogued = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: userLogued,
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el login", error: err.message });
  }
};

// -- BUSCA UN USUARIO POR id --
const getProfile = async (req, res) => {
  try {
    const user = req.user;  // --> DEL MIDDLEWARE DE AUTENTICACIÓN

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json(userResponse);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el perfil", error: err.message });
  }
};

// -- REFRECAR TOKEN --
const refreshToken = async (req, res) => {
  try {
    const user = req.user;  // --> DEL MIDDLEWARE DE AUTENTICACIÓN

    // Nuevo token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    res.json({
      message: "Token actualizado",
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar el token", error: err.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
};
