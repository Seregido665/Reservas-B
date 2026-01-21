const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },

    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },

    startHour: {
      type: String,
      required: [true, "La hora de inicio es obligatoria"],
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    endHour: {
      type: String,
      required: [true, "La hora de fin es obligatoria"],
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
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


// 🧠 VALIDACIÓN: endHour debe ser mayor que startHour
reservationSchema.pre("save", function (next) {
  if (this.startHour >= this.endHour) {
    return next(
      new Error("La hora de fin debe ser posterior a la de inicio")
    );
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
