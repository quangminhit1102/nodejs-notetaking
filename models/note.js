const mongoose = require("mongoose");
const shortid = require("shortid");
const Joi = require("joi");

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
    type: String,
    ref: "Type",
  },
});
const Validate = function (obj) {
  const noteValidateSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string()
      .when("_id", { is: null, then: Joi.required() })
      .max(30)
      .label("Title"),
    content: Joi.string()
      .when("_id", { is: null, then: Joi.required() })
      .max(500)
      .label("Content"),
    image: Joi.string().allow(""),
    typeId: Joi.string()
      .when("_id", { is: null, then: Joi.required() })
  });
  return noteValidateSchema.validate(obj);
};
module.exports = mongoose.model("Note", noteSchema);
module.exports.Validate = Validate;

