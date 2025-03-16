const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //fetch data from req
    const { title, description, timeDuration, sectionId } = req.body;

    //etract file from req
    const videoFile = req.files.videoFile;

    //validate data
    if (!title || !description || !timeDuration || !sectionId || !videoFile) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    // upload video url to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      videoFile,
      process.env.FOLDER_NAME
    );
    // create subSection entry in db
    const newSubSection = await SubSection.create({
      title,
      description,
      timeDuration,
      videoUrl: uploadDetails.secure_url,
    });

    console.log(`newSubSection--`, newSubSection);
    // add this new subSection to section schema
    const updatedSectionDetails = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSections: newSubSection._id,
        },
      },
      { new: true }
    );

    console.log(`updatedSectionDetails--`, updatedSectionDetails);
    // populate updatedSectionDetails with .populate("")

  
    return res.status(200).json({
      message: "SubSection created successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in createSubSection--`, err.message);
    return res.status(500).json({
      message: "Internal server error in createSubSection",
      success: false,
      error: err.message,
    });
  }
};



// update subSection


// delete subSection
