const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del espacio es obligatorio"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["SALA", "PISTA", "MESA"],
      required: [true, "El tipo de espacio es obligatorio"],
    },

    capacity: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad mínima es 1"],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Space", spaceSchema);
