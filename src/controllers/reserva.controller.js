// reserva.controller.js (actualizado)

const ReservationModel = require("../models/Reserva.Model");
const SpaceModel = require("../models/Space.Model");

// --- CREAR RESERVA ---
module.exports.createReservation = async (req, res) => {
  try {
    console.log("Body:", req.body);

    const { space, date, startHour, endHour } = req.body;

    // - VERIFICAR ESPACIO -
    const spaceFound = await SpaceModel.findById(space);
    if (!spaceFound || !spaceFound.active) {
      return res.status(400).json({ message: "Espacio no disponible" });
    }

    // - NORMALIZAR FECHA A UTC -
    const reservationDate = new Date(date);
    const startOfDay = new Date(Date.UTC(reservationDate.getUTCFullYear(), reservationDate.getUTCMonth(), reservationDate.getUTCDate(), 0, 0, 0, 0));

    const overlappingReservation = await ReservationModel.findOne({
      space,
      date: startOfDay,  // Buscamos exactamente el día normalizado en UTC
      $or: [{ startHour: { $lt: endHour }, endHour: { $gt: startHour } },],
      status: { $ne: "CANCELLED" }
    });

    if (overlappingReservation) {
      return res.status(400).json({
        message: "El espacio ya está reservado en ese horario"
      });
    }

    // -- CREAR --
    const reservation = await ReservationModel.create({
      user: req.user._id,
      space,
      date: startOfDay,  // Guardamos la fecha normalizada en UTC (medianoche)
      startHour,
      endHour
    });
    console.log("✅ Reserva creada:", reservation);

    return res.status(201).json(reservation);

  } catch (err) {
    console.error("Error en createReservation:", err);
    return res.status(500).json({ message: err.message });
  }
};

// --- RESERVAS DEL USUARIO ---
module.exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await ReservationModel.find({ user: req.user._id })
                                               .populate("space");

    return res.json(reservations); 
  } catch (err) {
    return res.status(500).json({ message: err.message }); 
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

    return res.json(reservations);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- CANCELAR RESERVA ---
module.exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);

    reservation.status = "CANCELLED";
    await reservation.save();

    return res.json({ message: "Reserva cancelada" }); 
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- REACTIVAR RESERVA ---
module.exports.reactivateReservation = async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);

    reservation.status = "PENDING";  
    await reservation.save();

    return res.json({ message: "Reserva reactivada" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- ELIMINAR RESERVA ---
module.exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);

    await ReservationModel.findByIdAndDelete(req.params.id);

    return res.json({ message: "Reserva eliminada permanentemente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};