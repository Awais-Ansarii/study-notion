const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // required: true,
    expires: 5*60,
  },
});
mongoose.exports = mongoose.model("OTP", otpSchema);
