const Section = require("../models/Section");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createSection = async (req, res) => {
  try {
    //fetch data from req
    const { sectionName, courseId } = req.body;

    const thumbnail = req.files.thumbnailImage;

    //validate data
    if (!sectionName || !courseId) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    // create course entry in db
    const newSection = await Section.create({
      sectionName,
    });

    console.log(`newSection--`, newSection);

    // add this new section to course schema
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // HW: How to use populate to get section and subSections with course details
    return res.status(200).json({
      message: "Section created successfully",
      success: true,
      updatedCourseDetails,
    });
  } catch (err) {
    console.log(`error in createSection--`, err.message);
    return res.status(500).json({
      message: "Internal server error in createSection",
      success: false,
      error: err.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //fetch data from req
    const { sectionName, sectionId } = req.body;

    //validate data
    if (!sectionName || !sectionId) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    // update section entry in db
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        sectionName,
      },
      { new: true }
    );

    console.log(`updatedSection--`, updatedSection);

    return res.status(200).json({
      message: "Section updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in updateSection--`, err.message);
    return res.status(500).json({
      message: "Internal server error in updateSection",
      success: false,
      error: err.message,
    });
  }
};




exports.deleteSection = async (req, res) => {
    try{
        const { sectionId } = req.params; //assuming we are sending id in params

        //validate data
        if (!sectionId) {
            return res.status(403).json({
                message: "Please fill all the fields",
                success: false,
            });
        }

        // delete section entry in db
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        console.log(`deletedSection--`, deletedSection);

        // todo[testing] : do we need to delete it from course schema?

        return res.status(200).json({
            message: "Section deleted successfully",
            success: true,
        });
    }catch(err){
        console.log(`error in deleteSection--`, err.message);
        return res.status(500).json({
            message: "Internal server error in deleteSection",
            success: false,
            error: err.message,
        });
    }
}
