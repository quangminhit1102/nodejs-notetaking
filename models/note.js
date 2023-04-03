const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    default: shortid.generate,
  },
});
module.exports = mongoose.model("User", userSchema);
