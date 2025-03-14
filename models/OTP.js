const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
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
    expires: 5 * 60,
  },
});

const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Email Verification",
      `<html>
        <body>
          <h1>Email Verification</h1>
          <p>Your OTP is ${otp}</p>
        </body>
      </html>
     `
    );

    console.log(`mailResponse--`, mailResponse);
  } catch (err) {
    console.log(`error in sendVerificationEmail--`, err.message);
  }
};

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

mongoose.exports = mongoose.model("OTP", otpSchema);
