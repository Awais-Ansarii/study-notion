const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Tags = require("../models/Tags");
const RatingAndReviews = require("../models/RatingAndReviews");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    //fetch data from req
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    const thumbnail = req.files.thumbnailImage;

    //validate data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(`instructorDetails--`, instructorDetails);


    // TODO: verify if user_id and instructor_id are same or different?

    if (!instructorDetails) {
      return res.status(404).json({
        message: "Instructor not found",
        success: false,
      });
    }

    //check given tag is valid/exist in db
    const tagDetail = await Tags.findById(tag);
    console.log(`tagDetail--`, tagDetail);
    if (!tagDetail) {
      return res.status(404).json({
        message: "Tag not found",
        success: false,
      });
    }

    // upload thumbnail image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create course entry in db
    const course = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tag: tagDetail._id,
      instructor: instructorDetails._id,
    });

    console.log(`course--`, course);

    // add this new course to user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: course._id,
        },
      },
      { new: true }
    );

    // add this new course to tags schema
    await Tags.findByIdAndUpdate(
      { _id: tagDetail._id },
      {
        $push: {
          course: course._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Course created successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in createCourse--`, err.message);
    return res.status(500).json({
      message: "Internal server error in createCourse",
      success: false,
      error: err.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    // get all course entry from db
    const courses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        instructor: true,
        price: true,
        thumbnail: true,
        tag: true,
        RatingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    console.log(`All course--`, courses);

    return res.status(200).json({
      message: "All Courses fetched successfully",
      success: true,
      allCourses: courses,
    });
  } catch (err) {
    console.log(`error in getAllCourses--`, err.message);
    return res.status(500).json({
      message: "Internal server error in getAllCourses",
      success: false,
      error: err.message,
    });
  }
};
