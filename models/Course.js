const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,

    trim: true,
  },
  courseDescription: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReviews",
    },
  ],
  price: {
    type: Number,
    // required: true,
  },
  thumbnail: {
    type: String,
    //   required: true,
    //   trim: true,
  },
  tag: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  studentEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});
mongoose.exports = mongoose.model("Course", courseSchema);
