const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  accountType: {
    type: String,
    required: true,
    enum: ["Admin", "Instructor", "Student"],
  },

  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String,
    required: true,
  },

  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});

mongoose.exports = mongoose.model("User", userSchema);
