const Categories = require("../models/Categories");
const Course = require("../models/Course");
const User = require("../models/User");

exports.ceateCategory = async (req, res) => {
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
    const Category = await Categories.create({
      name,
      description,
    });

    console.log(`Category--`, Category);

    return res.status(200).json({
      message: "Category created successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in ceateCategory--`, err.message);
    return res.status(500).json({
      message: "Internal server error in ceateCategory",
      success: false,
      error: err.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // get all tag entry from db
    const categories = await Categories.find(
      {},
      {
        name: true,
        description: true,
      }
    );

    console.log(`All Categories--`, categories);

    return res.status(200).json({
      message: "All Categories fetched successfully",
      success: true,
      allCategories: categories,
    });
  } catch (err) {
    console.log(`error in getAllCategories--`, err.message);
    return res.status(500).json({
      message: "Internal server error in getAllCategories",
      success: false,
      error: err.message,
    });
  }
};



