const mongoose = require("mongoose");
const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    // required: true,
    type: String,
    trim: true,
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
mongoose.exports = mongoose.model("Tags", tagsSchema);
