const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  age: {
    type: String,
  },
  about: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
});

mongoose.exports = mongoose.model("Profile", profileSchema);
