const SpaceModel = require("../models/Space.Model");

// --- CREAR ESPACIO (ADMIN) ---
module.exports.createSpace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const space = await SpaceModel.create(req.body);
    res.status(201).json(space);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- OBTENER TODOS LOS ESPACIOS ---
module.exports.getSpaces = async (req, res) => {
  try {
    const spaces = await SpaceModel.find();
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- OBTENER ESPACIO POR ID ---
module.exports.getSpaceById = async (req, res) => {
  try {
    const space = await SpaceModel.findById(req.params.id);
    res.json(space);
  } catch (err) {
    res.status(404).json({ message: "Espacio no encontrado" });
  }
};

// --- ACTUALIZAR ESPACIO (ADMIN) ---
module.exports.updateSpace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const space = await SpaceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(space);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
