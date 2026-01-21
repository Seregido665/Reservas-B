const BookModel = require("../models/Book.model");

// --- CONJUNTO DE OPERACIONES HECHAS CON LA BASE DE DATOS "books" ---
// ----- A --> routes.config.js
// - MUESTRA TODOS LOS LIBROS -
module.exports.getBooks = (req, res, next) => {
  BookModel.find()
    .populate("user")
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      console.log("entro", err);
      res.json(err);
    });
};

// -- PARA BUSCAR UN LIBRO POR EL AUTOR :React --
module.exports.searchBooks = (req, res, next) => {
  const authorQuery = req.query.author;
  BookModel.findOne({ author: authorQuery })
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.json(err);
    });
};

// - BUSCA UN LIBRO POR id -
module.exports.getBookById = (req, res, next) => {
  const id = req.params.id;

  BookModel.findById(id)
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.json(err);
    });
};

// - CREA UN LIBRO -
module.exports.createBook = (req, res, next) => {
  const newBook = req.body;

  // SI SE SUBE UNA IMAGEN --> agregar la URL y el public_id
  if (req.file) {
    newBook.image = req.file.path; // URL de Cloudinary
    newBook.imagePublicId = req.file.filename; // Public ID de Cloudinary
  }

  BookModel.create(newBook)
    .then((bookCreated) => {
      res.status(201).json({ message: "Libro creado exitosamente", book: bookCreated });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error al crear libro", error: err.message });
    });
}


// -- BORRAR UN LIBRO :React ---
// USAMOS try - catch CON async - await PARA RESPETAR EL ORDEN DE LAS OPERACIONES
// DEBIDO A QUE HAY UNA IMAGEN SOBRETODO.
module.exports.deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    // 1.- Obtener el libro para eliminar la imagen de Cloudinary
    const book = await BookModel.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    // 2.- Si el libro tiene una imagen, eliminarla de Cloudinary
    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    // 3.- Eliminar el libro de la base de datos
    await BookModel.findByIdAndDelete(id);

    res.json({ message: "Libro eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar libro", error: err.message });
  }
};

// -- ACTUALIZAR UN LIBRO :React --
//    try - catch CON async - await PARA RESPETAR EL ORDEN DE LAS OPERACIONES
module.exports.updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (req.file) {
      // 1.- Obtener el libro para eliminar la imagen
      const currentBook = await BookModel.findById(id);

      // 2.- Si el libro tiene una imagen eliminarla de Cloudinary
      if (currentBook && currentBook.imagePublicId) {
        await cloudinary.uploader.destroy(currentBook.imagePublicId);
      }

      // 3.- Agregar la nueva imagen
      updates.image = req.file.path;
      updates.imagePublicId = req.file.filename;
    }

    const updatedBook = await BookModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json({ message: "Libro actualizado exitosamente", book: updatedBook });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar libro", error: err.message });
  }
};