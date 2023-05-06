const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
    resetPassword: String,
    resetPasswordExpire: String,
    types: [
      {
        type: String,
        ref: "Type",
      },
    ],
    notes: [{ type: String, ref: "Note" }],
    token: { type: String },
  },
  { timestamps: true } // set CreateTime, UpdateTime
);
module.exports = mongoose.model("User", userSchema);
