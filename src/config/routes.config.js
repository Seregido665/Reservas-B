const express = require("express");
const router = express.Router();


console.log("✅ routes.config.js cargado");


// --- CONTROLADORES ---
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const spaceController = require("../controllers/space.controller");
const reservationController = require("../controllers/reserva.controller");

// --- MIDDLEWARES ---
const { authenticateToken, isAdmin } = require("../middlewares/auth.middleware");

// AUTH
// ------------------------------------------------------------------
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateToken, authController.getProfile);
router.post("/refresh-token", authenticateToken, authController.refreshToken);

// USERS (ADMIN)
// ------------------------------------------------------------------
router.get("/users", authenticateToken, isAdmin, usersController.getUsers);
router.delete("/users/:id", authenticateToken, isAdmin, usersController.deleteUser);
router.patch("/users/:id", authenticateToken, isAdmin, usersController.updateUser);

// SPACES
// ------------------------------------------------------------------
router.get("/spaces", authenticateToken, spaceController.getSpaces);
router.get("/spaces/:id", authenticateToken, spaceController.getSpaceById);
router.post("/spaces", authenticateToken, isAdmin, spaceController.createSpace);
router.patch("/spaces/:id", authenticateToken, isAdmin, spaceController.updateSpace);

// RESERVATIONS
// ------------------------------------------------------------------
router.post("/reservations", authenticateToken, reservationController.createReservation);
router.get("/reservations/me", authenticateToken, reservationController.getMyReservations);
router.get("/reservations", authenticateToken, isAdmin, reservationController.getAllReservations);
router.patch(
  "/reservations/:id/cancel", authenticateToken, reservationController.cancelReservation);

module.exports = router;
