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
  image: {
    type: String,
  },
  _id: {
    type: String,
    default: shortid.generate,
  },
  user: {},
  type: {
    type: Schema.Types.ObjectId,
    ref: "Type",
  },
});
module.exports = mongoose.model("Note", noteSchema);
