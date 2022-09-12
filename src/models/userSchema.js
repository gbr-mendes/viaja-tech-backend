const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { cpf } = require("cpf-cnpj-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["isLead", "isClient", "isSalesManager", "isSiteAdmin", "isAdmin"],
    default: "isLead",
  },
  avatar: {
    type: String,
    default: "",
  },
  notfications: {
    type: Boolean,
    default: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.pre("save", async function (next) {
  const formattedCPF = cpf.format(this.cpf);
  this.cpf = formattedCPF;
  next();
});

module.exports = mongoose.model("User", userSchema);
