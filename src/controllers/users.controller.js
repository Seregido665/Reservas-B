const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

// --- CONJUNTO DE OPERACIONES HECHAS CON LA BASE DE DATOS "users" ---
// ----- A --> routes.config.js
// -- REGISTRAR UN USUARIO --
/*module.exports.registerUser = (req, res, next) => {
  const newUser = req.body;
  const userEmail = newUser.email;

  UserModel.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        UserModel.create(newUser)
          .then(() => {
            res.status(201).json("Usuario creado correctamente");
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        res.status(422).json({ message: "El usuario ya existe" });
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

// -- LOGUEO DE USUARIO --
module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      } else {
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Credenciales incorrectas" });
        } else {
          return res.status(200).json(user);
        }
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Error del servidor" });
    });
};

// - BUSCA UN USUARIO POR id -
module.exports.getUserById = (req, res, next) => {
  const id = req.params.id;

  UserModel.findById(id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
};
*/

// - MUESTRA TODOS LOS USUARIOS -
module.exports.getUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
};

// -- BORRAR UN USUARIO :React ---
module.exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  UserModel.findByIdAndDelete(id)
    .then(() => {
      res.json("Book deleted successfully");
    })
    .catch((err) => {
      res.json(err);
    });
};

// -- ACTUALIZAR UN USUARIO :React --
module.exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;

  UserModel.findByIdAndUpdate(id, updates, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
};
