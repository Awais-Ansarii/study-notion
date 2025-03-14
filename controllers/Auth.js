// send OTP
const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();
//send OTP
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req.body
    const email = req.body.email;

    //check if user exists in the database
    const userExist = await User.findOne({ email });

    //if user exists
    if (userExist) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    // if user doesn't exist => generate OTP

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialCharacters: false,
    });

    console.log(`otp--`, otp);

    // otp must be unique
    const otpExist = await OTP.findOne({ otp: otp });

    while (otpExist) {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialCharacters: false,
      });
      otpExist = await OTP.findOne({ otp });
    }

    // create entry in db
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(`otpBody--`, otpBody);

    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true });
  } catch (err) {
    console.log(`error in sendOTP--`, err.message);
    return res.status(500).json({
      message: "Internal server error in sendOTP",
      success: false,
      error: err.message,
    });
  }
};

// signUp
exports.signUp = async (req, res) => {
  try {
    //fetch data from req.body
    console.log(`req.body--`, req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
      contactNumber,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    //check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }
    //if user doesn't exist then match passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords don't match",
        success: false,
      });
    }

    //  get most recent otp from OTP collection
    const mostRecentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(`mostRecentOtp--`, mostRecentOtp);

    // validate OTP
    if (!mostRecentOtp || mostRecentOtp.length === 0) {
      return res.status(401).json({
        message: "OTP not found",
        success: false,
      });
    } else if (mostRecentOtp !== otp) {
      return res.status(401).json({
        message: "OTP is invalid",
        success: false,
      });
    }

    //hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile
    const profile = await Profile.create({
      gender: null,
      age: null,
      about: null,
      contactNumber: null,
    });

    //create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed${firstName} ${lastName}`,
    });

    console.log(`user--`, user);

    return res.status(200).json({
      message: "User created successfully",
      success: true,
    });

    // create user
  } catch (err) {
    console.log(`error in signUp--`, err.message);
    return res.status(500).json({
      message: "Internal server error in signUp",
      success: false,
      error: err.message,
    });
  }
};

// login

exports.login = async (req, res) => {
  try {
    //fetch data from req.body
    console.log(`req.body--`, req.body);
    const { email, password } = req.body;

    //validate data
    if (!email || !password) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    //check if user exists in the database
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    //check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    // generate jwt token
    const payload = {
      userId: user._id,
      email: user.email,
      accountType: user.accountType,
    };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    user.token = token; // use toObject()
    user.password = undefined;

    // create cookie

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
      message: "User logged in successfully",
      success: true,
      user: user,
      token: token,
    });
  } catch (err) {
    console.log(`error in login--`, err.message);
    return res.status(500).json({
      message: "Internal server error in login",
      success: false,
      error: err.message,
    });
  }
};

// changePassword
exports.changePassword = async (req, res) => {
  try {
    // fetch data from req body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //validate
    if (!oldPassword || !newPassword || !confirmPassword) {
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
    // update password in db
    // send email password updated to user
    // return response

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in changePassword--`, err.message);
    return res.status(500).json({
      message: "Internal server error in changePassword",
      success: false,
      error: err.message,
    });
  }
};
