const { json } = require("express");
const Type = require("../models/type"); //Model Type
const Note = require("../models/note"); //Model Note
const { errorMonitor, promises } = require("nodemailer/lib/xoauth2");

// Get All Type
exports.getAllType = (req, res, next) => {
  Type.find({})
    .then((result) => {
      return res.json({
        error: false,
        message: "Get data success",
        data: result,
      });
    })
    .catch((err) => {
      return res.json({ error: true, message: err, data: result });
    });
};
// Add Type
exports.postAddType = (req, res, next) => {
  const title = req.body.title;
  const color = req.body.color;
  const description = req.body.description;

  Type.findOne({ title: title }).then((type) => {
    if (type) {
      return res.json({
        error: true,
        message: "Already have that Type!",
        data: [],
      });
    } else {
      let newType = new Type({
        title: title,
        color: color,
        description: description,
      });
      console.log(req.body);
      newType.save().then((result) => {
        if (result.errors) {
          return res.status(200).json(result);
        } else {
          return res.json({
            error: false,
            message: "Create type successfully!",
            data: [],
          });
        }
      });
    }
  });
};
// Get One Type By ID
exports.getTypeById = (req, res, next) => {
  let _id = req.params.id;
  Type.findOne({ _id: _id })
    .then((result) => {
      return res.status(200).json({
        error: false,
        message: "Get data success",
        data: result,
      });
    })
    .catch((err) => {
      return res.json({ error: true, message: err, data: [] });
    });
};
// Edit Type by ID
exports.postEditTypeById = (req, res, next) => {
  let _id = req.params.id;
  const { title } = req.body;
  const { color } = req.body;
  const { description } = req.body;

  Type.updateOne(
    { _id: _id },
    { title: title, color: color, description: description }
  ).then((err) => {
    if (err) {
      return res.json({
        error: false,
        message: "Update type successfully!",
        data: [],
      });
    } else {
      return res.json({
        error: true,
        message: "There was a error!",
        data: [],
      });
    }
  });
};
// Delele Type
exports.deleteTypeById = (req, res, next) => {
  let _id = req.params.id;
  Type.deleteOne({ _id: _id }).then((err) => {
    if (err) {
      return res.json({
        error: false,
        message: "Delete type successfully!",
        data: [],
      });
    } else {
      return res.json({
        error: true,
        message: "There was a error!",
        data: [],
      });
    }
  });
};

// Create new Note
exports.postAddNote = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.body.image;
  const typeId = req.body.noteType;
  Note.create({
    title: title,
    content: content,
    image: image,
    type:typeId
  }).then((result) => {
    Type.findByIdAndUpdate(typeId, { $push: { notes: result._id } })
      .then((result) => {
        return res.json({
          error: false,
          message: "Create note successfully!",
          data: [],
        });
      })
      .catch((err) => {
        return res.json({ error: true, message: err, data: result });
      });
  });
  // Type.findOne({ _id: typeId }).then((type) => {
  //   if (type) {
  //     let newNote = new Note({
  //       title: title,
  //       content: content,
  //       image: image,
  //       type: type,
  //     });
  //     newNote.save().then((result) => {
  //       if (result.errors) {
  //         return res.status(200).json(result);
  //       } else {
  //         type.notes.push(newNote);
  //         type.save();
  //         return res.json({
  //           error: false,
  //           message: "Create note successfully!",
  //           data: [],
  //         });
  //       }
  //     });
  //   } else {
  //     return res.json({ error: true, message: err, data: result });
  //   }
  // });
};
// Get All Type
exports.getAllNote = (req, res, next) => {
  Note.find()
    .populate("type")
    .exec()
    .then((result) => {
      return res.json({
        error: false,
        message: "Get data success",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: true, message: err, data: result });
    });
};
