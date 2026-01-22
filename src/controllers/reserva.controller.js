const ReservationModel = require("../models/Reserva.Model");
const SpaceModel = require("../models/Space.Model");

// --- CREAR RESERVA ---
module.exports.createReservation = async (req, res) => {
  try {
    console.log("🔹 Body recibido:", req.body);
    console.log("🔹 Usuario autenticado:", req.user);

    const { space, date, startHour, endHour } = req.body;

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

    // ── Normalizar la fecha (¡esto faltaba!) ──
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);   // quita hora, minutos, etc. → solo día

    // Comprobar solapamientos
    const overlappingReservation = await ReservationModel.findOne({
      space,
      date: normalizedDate,                    // ← ahora sí existe
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
      date,               // puedes guardar la original con hora si quieres
      // o date: normalizedDate  si prefieres guardarla limpia
      startHour,
      endHour
    });

    console.log("✅ Reserva creada:", reservation);
    return res.status(201).json(reservation);

  } catch (err) {
    console.error("❌ Error en createReservation:", err);
    return res.status(500).json({ message: err.message });
  }
};

// --- RESERVAS DEL USUARIO ---
module.exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await ReservationModel.find({
      user: req.user._id, // ✅ Cambiado de req.user.id a req.user._id
    }).populate("space");

    return res.json(reservations); // ✅ AÑADIR RETURN
  } catch (err) {
    return res.status(500).json({ message: err.message }); // ✅ AÑADIR RETURN
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

    return res.json(reservations); // ✅ AÑADIR RETURN
  } catch (err) {
    return res.status(500).json({ message: err.message }); // ✅ AÑADIR RETURN
  }
};

// --- CANCELAR RESERVA ---
module.exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (
      req.user.role !== "admin" &&
      reservation.user.toString() !== req.user._id.toString() // ✅ Cambiado
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    reservation.status = "CANCELLED";
    await reservation.save();

    return res.json({ message: "Reserva cancelada" }); // ✅ AÑADIR RETURN
  } catch (err) {
    return res.status(500).json({ message: err.message }); // ✅ AÑADIR RETURN
  }
};

// --- REACTIVAR RESERVA ---
module.exports.reactivateReservation = async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (
      req.user.role !== "admin" &&
      reservation.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (reservation.status !== "CANCELLED") {
      return res.status(400).json({ message: "La reserva no está cancelada" });
    }

    reservation.status = "PENDING";  // O "CONFIRMED" si prefieres
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

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (
      req.user.role !== "admin" &&
      reservation.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await ReservationModel.findByIdAndDelete(req.params.id);

    return res.json({ message: "Reserva eliminada permanentemente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
