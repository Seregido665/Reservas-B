const express = require("express");
const router = express.Router();

const booksController = require("../controllers/book.controller");
const libraryController = require("../controllers/libraries.controller");
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const { upload } = require("./cloudinary.config");
const { authenticateToken } = require("../middlewares/auth.middleware");


// --- AUTHENTICATION ---
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateToken, authController.getProfile);
router.post("/refresh-token", authenticateToken, authController.refreshToken);


// --- BOOKS ---
router.get("/books", authenticateToken, booksController.getBooks);
router.get("/books/search", authenticateToken, booksController.searchBooks);
router.get("/books/:id", booksController.getBookById);
router.post("/books", authenticateToken,
  upload.single("image"),
  booksController.createBook
);
router.delete("/books/:id", authenticateToken, booksController.deleteBook);
router.patch("/books/:id", authenticateToken,
  upload.single("image"),
  booksController.updateBook
);  


// --- USERS --- 
//router.post("/register", usersController.registerUser);
//router.post("/login", usersController.loginUser);
//router.get("/user/:id", usersController.getUserById);
router.get("/users", usersController.getUsers);
router.delete("/user/:id", usersController.deleteUser);
router.patch("/user/:id", usersController.updateUser);


// --- LIBRARIES --- 
router.get("/libraries", libraryController.getLibraries);
router.post("/libraries", libraryController.createLibrary);
router.get("/libraries/:id", libraryController.getLibraryById);
router.delete("/libraries/:id", libraryController.deleteLibrary);

module.exports = router;
