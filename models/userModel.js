const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: [true, "Username already exists! Please use another one."],
    minlength: [3, "Username is too short"],
    maxlength: [30, "Username is too long"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: [true, "Username already exists! Please use another one."],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password is too short"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  photo: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("User", userSchema);
