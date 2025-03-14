const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
// reset password token

exports.resetPasswordToken = async (req, res) => {
  try {
    // fetch data from req.body
    const { email } = req.body;

    //validate data
    if (!email) {
      return res.status(403).json({
        message: "Email is required",
        success: false,
      });
    }

    //check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    // generate reset password token string using crypto
    const token = crypto.randomUUID();
    console.log(`token--`, token);

    const updatedUuser = await User.findOneAndUpdate(
      { email: user.email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    console.log(`updatedUuser--`, updatedUuser);

    const url = `http://localhost:3000/update-password/${token}`;
    console.log(`url--`, url);

    // send email with reset password link

    await mailSender(
      email,
      "Reset Password",
      `<html>
        <body>
          <h1>Reset Password</h1>
          <p>Click on the following link to reset your password</p>
          <a href="${url}">${url}</a>
        </body>
      </html>
     `
    );

    return res.status(200).json({
      message: "Reset password email sent successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in resetPasswordToken--`, err.message);
    return res.status(500).json({
      message: "Internal server error in resetPasswordToken",
      success: false,
      error: err.message,
    });
  }
};

// reset/forgot password

exports.resetPassword = async (req, res) => {
  try {
    // fetch data from req.body
    const { token, newPassword, confirmPassword } = req.body;

    //validate data
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    // compare new and confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password don't match",
        success: false,
      });
    }

    // check if token is valid
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(401).json({
        message: "user not found",
        success: false,
      });
    }

    if(user.resetPasswordExpires < Date.now()){
        return res.status(401).json({
            message: "Token is expired",
            success: false,
        });
    }

    // hash password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password in db
    const updatedUser = await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    console.log(`updatedUser--`, updatedUser);

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in resetPassword--`, err.message);
    return res.status(500).json({
      message: "Internal server error in resetPassword",
      success: false,
      error: err.message,
    });
  }
};
