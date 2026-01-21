// -- LIBRARIES --
const LibraryModel = require("../models/Library.model");

module.exports.getLibraries = (req, res) => {
  LibraryModel.find()
    .then((library) => {
      res.json(library);  
    })
    .catch((error) => {
      console.error(error);
      res.json(error);
    });
};

module.exports.createLibrary = (req, res) => {
  LibraryModel.create(req.body)
    .then(() => {
      res.json("Libreria creada!");  
    })
    .catch((error) => {
      res.json(error);
    });
};


module.exports.getLibraryById = (req, res) => {
  const id = req.params.id;
  LibraryModel.findById(id)
    .then((library) => {
      res.json(library);  
    })
    .catch((error) => {
      res.json(error);
    });
};


module.exports.deleteLibrary =(req, res, next) => {
  const id = req.params.id;
  LibraryModel.findByIdAndDelete(id)
    .then(() => {
      res.json("Libreria borrada!");  
    })
    .catch((error) => {
      res.json(error);
    });
};
