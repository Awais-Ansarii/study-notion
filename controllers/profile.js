const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    //fetch user id from req.user
    const userId = req.user.id;
    console.log(`userId--`, userId);

    //fetch data from req
    const {
      firstName,
      lastName,
      about = "",
      contactNumber,
      gender,
      age = null,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !about ||
      !contactNumber ||
      !gender ||
      !age
    ) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    //get profile id
    const user = await User.findById(userId);
    console.log(`user--`, user);
    const profileId = user.additionalDetails;

    // get profile data
    const profile = await Profile.findById(profileId);
    console.log(`profile--`, profile);

    // update profile entry in db
    // const updatedProfile = await Profile.findByIdAndUpdate(
    //   { _id: profileId },
    //   {
    //     firstName,
    //     lastName,
    //     about,
    //     contactNumber,
    //     gender,
    //     age,
    //   },
    //   { new: true }
    // );

    console.log(`updatedProfile--`, updatedProfile);

    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    profile.age = age;

    const updatedProfile = await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      updatedProfile,
    });
  } catch (err) {
    console.log(`error in updateProfile--`, err.message);
    return res.status(500).json({
      message: "Internal server error in updateProfile",
      success: false,
      error: err.message,
    });
  }
};

//

exports.deleteAccount = async (req, res) => {
  try {
    //fetch user id from req.user
    const userId = req.user.id;
    console.log(`userId--`, userId);

    //get profile id
    const user = await User.findById(userId);
    console.log(`user--`, user);

    // validate user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    } 
    const profileId = user.additionalDetails;

    // delete profile entry in db
    const deletedProfile = await Profile.findByIdAndDelete(profileId);

    console.log(`deletedProfile--`, deletedProfile);

    // todo: unenroll this user from all courses in which user is enrolled


    // delete user entry in db
    const deletedUser = await User.findByIdAndDelete(userId);


    return res.status(200).json({
      message: "Profile deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log(`error in deleteProfile--`, err.message);
    return res.status(500).json({
      message: "Internal server error in deleteProfile",
      success: false,
      error: err.message,
    });
  }
};


exports.getAllUserDetails = async (req, res) => {
    try{
        //fetch user id from req.user
        const userId = req.user.id;
        console.log(`userId--`, userId);

        const userDetails = await User.findById(userId).populate("additionalDetails").exec();
        console.log(`userDetails--`, userDetails);
        return res.status(200).json({
            message: "All User Details fetched successfully",
            success: true,
            userDetails,
        });
    }
    catch(err){
        console.log(`error in getAllUserDetails--`, err.message);
        return res.status(500).json({
            message: "Internal server error in getAllUserDetails",
            success: false,
            error: err.message,
        });
    }
}