const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    default: shortid.generate,
  },
});
module.exports = mongoose.model("User", userSchema);
