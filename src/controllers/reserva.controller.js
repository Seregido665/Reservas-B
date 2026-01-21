const ReservationModel = require("../models/Reserva.Model");

// --- CREAR RESERVA ---
module.exports.createReservation = async (req, res) => {
  try {
    const { space, date, startHour, endHour } = req.body;

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

    // Crear reserva
    const reservation = await ReservationModel.create({
      user: req.user._id,
      space,
      date,
      startHour,
      endHour
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- RESERVAS DEL USUARIO ---
module.exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await ReservationModel.find({
      user: req.user._id
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
      reservation.user.toString() !== req.user._id.toString()
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
