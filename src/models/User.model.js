const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido!"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  email: {
    type: String,
    required: [true, "El email es requerido!"],
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida!"],
    minLength: [8, "Al menos 8 caracteres!"],
  },
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id; 
      delete ret.password; 
      delete ret._id;      
      delete ret.__v;     
    } 
  },
  toObject: { virtuals: true },
});

userSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

userSchema.virtual("spaces", {
  ref: "Space",
  localField: "_id",
  foreignField: "createdBy",
  justOne: false,
});


// --- HASHEO DE contraseñas --> SOLO PARA React ---
userSchema.pre("save", function (next) {   
  const user = this;

  if (!user.isModified("password")) {  
    return next();
  }

  // VALOR ALEATORIO UNICO A MI CONTRASEÑA CON 10 RONDAS DE ENCRIPTACION.
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashedPassword;
});

module.exports = mongoose.model("User", userSchema);
