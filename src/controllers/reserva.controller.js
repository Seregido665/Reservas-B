const ReservationModel = require("../models/Reserva.Model");
const SpaceModel = require("../models/Space.Model");

// --- CREAR RESERVA ---
module.exports.createReservation = async (req, res) => {
  try {
    console.log("🔹 Body recibido:", req.body); // Debug
    console.log("🔹 Usuario autenticado:", req.user); // Debug

    const { space, date, startHour, endHour } = req.body;

    // ✅ Validaciones básicas
    if (!space || !date || !startHour || !endHour) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios: space, date, startHour, endHour" 
      });
    }

    // Verificar espacio
    const spaceFound = await SpaceModel.findById(space);
    if (!spaceFound || !spaceFound.active) {
      return res.status(400).json({ message: "Espacio no disponible" });
    }

    // Comprobar solapamientos
    const overlappingReservation = await ReservationModel.findOne({
      space,
      date,
      startHour: { $lt: endHour },
      endHour: { $gt: startHour },
      status: { $ne: "CANCELLED" }
    });

    if (overlappingReservation) {
      return res.status(400).json({
        message: "El espacio ya está reservado en ese horario"
      });
    }

    // ✅ Crear reserva con el usuario del token
    const reservation = await ReservationModel.create({
      user: req.user._id, // ✅ Viene del middleware
      space,
      date,
      startHour,
      endHour
    });

    console.log("✅ Reserva creada:", reservation); // Debug
    res.status(201).json(reservation);

  } catch (err) {
    console.error("❌ Error en createReservation:", err); // Debug
    res.status(500).json({ message: err.message });
  }
};

// Resto de funciones sin cambios...
// --- RESERVAS DEL USUARIO ---
module.exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await ReservationModel.find({
      user: req.user.id
    }).populate("space");

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- TODAS LAS RESERVAS (ADMIN) ---
module.exports.getAllReservations = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const reservations = await ReservationModel.find()
      .populate("user")
      .populate("space");

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- CANCELAR RESERVA ---
module.exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);

    if (
      req.user.role !== "admin" &&
      reservation.user.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    reservation.status = "CANCELLED";
    await reservation.save();

    res.json({ message: "Reserva cancelada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
