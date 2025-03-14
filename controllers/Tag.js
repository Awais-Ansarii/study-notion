const Tags = require("../models/Tags");
const Course = require("../models/Course");
const User = require("../models/User");

exports.ceateTag = async (req, res) => {
  try {
    // fetch data from req.body
    const { name, description } = req.body;

    //validate data
    if (!name || !description) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    // create tag entry in db
    const tag = await Tags.create({
      name,
      description,
    });

    console.log(`tag--`, tag);

    return res.status(200).json({
      message: "Tag created successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in ceateTag--`, err.message);
    return res.status(500).json({
      message: "Internal server error in ceateTag",
      success: false,
      error: err.message,
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    // get all tag entry from db
    const tags = await Tags.find(
      {},
      {
        name: true,
        description: true,
      }
    );

    console.log(`All tag--`, tags);

    return res.status(200).json({
      message: "All Tags fetched successfully",
      success: true,
      allTags: tags,
    });
  } catch (err) {
    console.log(`error in getAllTags--`, err.message);
    return res.status(500).json({
      message: "Internal server error in getAllTags",
      success: false,
      error: err.message,
    });
  }
};



