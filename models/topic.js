const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    default: shortid.generate,
  },
});
module.exports = mongoose.model("Topic", topicSchema);
