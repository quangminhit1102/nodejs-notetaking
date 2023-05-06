const mongoose = require("mongoose");
const shortid = require("shortid");
const Joi = require("joi");

const Schema = mongoose.Schema;

const typeSchema = new Schema(
  {
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
    notes: [
      {
        type: String,
        ref: "Note",
      },
    ],
    user: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true } // set CreateTime, UpdateTime
);
// Validation For Note Model
const Validate = function (obj) {
  const typeValidateSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string()
      .when("_id", { is: null, then: Joi.required() })
      .max(30)
      .messages({
        "string.empty": `"Title" is a required field`,
        "string.max": `Maximun Title length is 30 characters!`,
      }),
    description: Joi.string()
      .when("_id", { is: null, then: Joi.required() })
      .max(50)
      .label("Description"),
    color: Joi.string().when("_id", { is: null, then: Joi.required() }),
    user: Joi.string().when("_id", { is: null, then: Joi.required() }),
  });
  return typeValidateSchema.validate(obj);
};
module.exports = mongoose.model("Type", typeSchema);
module.exports.Validate = Validate;
