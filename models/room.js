const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomname: {
      type: String,
      required: true,
    },
    expireDay: {
      type: String,
    },
    _id: {
      type: String,
      default: shortid.generate,
    },
    user: { type: String, ref: "User" },
  },
  { timestamps: true } // set CreateTime, UpdateTime
);
module.exports = mongoose.model("Room", roomSchema);
