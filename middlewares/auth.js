const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("dotenv");
env.config();

//auth

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.header("Authorisation").replace("Bearer ", "") ||
      req.body.token;

    console.log(`token in auth--`, auth);

    // validate token
    if (!token) {
      return res.status(401).json({
        message: "No token found",
        success: false,
      });
    }
    // verify jwt token
    try {
      const decode =  jwt.verify(token, process.env.JWT_SECRET);
      console.log(`decode--`, decode);
      req.user = decode;
    } catch (err) {
      console.log(`err in verifying token, `, err.message);
      return res.status(401).json({
        message: "Token is invalid",
        success: false,
      });
    }
    next();
  } catch (err) {
    console.log(`error in auth--`, err.message);
    return res.status(500).json({
      message: "Internal server error in auth",
      success: false,
      error: err.message,
    });
  }
};



// isStudent

exports.isStudent = async (req, res, next) => {
  try {
    // check if user is student
    // const user = await User.findOne({ email: req.user.email });
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        message: "You are not a student",
        success: false,
      });
    }
    next();
  } catch (err) {
    console.log(`error in isStudent--`, err.message);
    return res.status(500).json({
      message: "Internal server error in isStudent",
      success: false,
      error: err.message,
    });
  }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    // check if user is instructor
    // const user = await User.findOne({ email: req.user.email });
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        message: "You are not an instructor",
        success: false,
      });
    }
    next();
  } catch (err) {
    console.log(`error in isInstructor--`, err.message);
    return res.status(500).json({
      message: "Internal server error in isInstructor",
      success: false,
      error: err.message,
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    // check if user is admin
    // const user = await User.findOne({ email: req.user.email });
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        message: "You are not an admin",
        success: false,
      });
    }
    next();
  } catch (err) {
    console.log(`error in isAdmin--`, err.message);
    return res.status(500).json({
      message: "Internal server error in isAdmin",
      success: false,
      error: err.message,
    });
  }
};
