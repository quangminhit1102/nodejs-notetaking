const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const typeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#fff",
  },
  _id: {
    type: String,
    default: shortid.generate,
  },
});
module.exports = mongoose.model("Type", typeSchema);
