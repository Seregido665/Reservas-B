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
  // MONGO GENERA UN ID PERO ASI: _id
  // Para cambiarlo en el JSON:
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id; // Pasamos '_id' a 'id'
      delete ret.password; // Eliminamos 'password'
      delete ret._id;      
      delete ret.__v;     
    } 
  }
});

userSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});


// --- HASHEO DE contraseñas --> SOLO PARA React ---
userSchema.pre("save", function (next) {   
  const user = this;

  // PARA COMPROBAR QUE NO SE HA CAMBIADO LA CONTRASEÑA Y QUE NO SE hashee DE NUEVO.
  if (!user.isModified("password")) {  
    return next();
  }

  // VALOR ALEATORIO UNICO A MI CONTRASEÑA CON 10 RONDAS DE ENCRIPTACION.
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashedPassword;
});

module.exports = mongoose.model("User", userSchema);
