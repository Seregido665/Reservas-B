const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  // MONGO GENERA UN ID PERO ASI: _id
  // Para cambiarlo:
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id; // Pasamos '_id' a 'id'
      delete ret._id;   // Eliminamos '_id'
      delete ret.__v;      // Y '__v'
    }
  }
});

module.exports = mongoose.model("Library", librarySchema);