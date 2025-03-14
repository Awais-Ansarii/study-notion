const mongoose = require("mongoose");
const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});
mongoose.exports = mongoose.model("SubSection", subSectionSchema);
