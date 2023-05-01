const { json } = require("express");
const Type = require("../models/type"); //Model Type
const Note = require("../models/note"); //Model Note

//#region Type API
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
  let { error } = Type.Validate({
    title: title,
    color: color,
    description: description,
  });
  if (error == null) {
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
  } else {
    return res.json({
      error: true,
      message: error?.details[0]?.message,
      data: [],
    });
  }
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
exports.patchEditTypeById = (req, res, next) => {
  let _id = req.params.id;
  const { title } = req.body;
  const { color } = req.body;
  const { description } = req.body;
  let { error } = Type.Validate({
    title: title,
    color: color,
    description: description,
  });
  if (error == null) {
    Type.findOneAndUpdate(
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
  } else {
    return res.json({
      error: true,
      message: error?.details[0]?.message,
      data: [],
    });
  }
};
// Delele Type
exports.deleteTypeById = (req, res, next) => {
  let _id = req.params.id;
  Type.deleteOne({ _id: _id }).then((err) => {
    if (err) {
      Note.deleteMany({ type: _id }).then((note) => {
        return res.json({
          error: false,
          message: "Delete type successfully!",
          data: [],
        });
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
//#endregion

//#region Note API
// Create new Note
exports.postAddNote = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.body.image;
  const typeId = req.body.noteType;
  let { error } = Note.Validate({
    title: title,
    content: content,
    image: image,
    typeId: typeId,
  });
  if (error == null) {
    Note.create({
      title: title,
      content: content,
      image: image,
      type: typeId,
    }).then((result) => {
      Type.findByIdAndUpdate(typeId, { $push: { notes: result._id } })
        .then((result) => {
          if (result) {
            return res.json({
              error: false,
              message: "Create note successfully!",
              data: [],
            });
          } else {
            return res.json({
              error: true,
              message: "There was an error!",
              data: [],
            });
          }
        })
        .catch((err) => {
          return res.json({ error: true, message: err, data: result });
        });
    });
  } else {
    return res.json({
      error: true,
      message: error?.details[0]?.message,
      data: [],
    });
  }
};
// Get All Note
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
//Get Note By Id
exports.getNoteById = (req, res, next) => {
  let _id = req.params.id;
  Note.findById(_id)
    .then((note) => {
      if (note) {
        return res.status(200).json({
          error: false,
          message: "Get data success!",
          data: note,
        });
      } else {
        return res.json({
          error: true,
          message: "Note Not Found!",
          data: [],
        });
      }
    })
    .catch((err) => {
      return res.json({
        error: true,
        message: "There was a error!",
        data: [],
      });
    });
};
//Edit Note by Id
exports.patchEditNoteById = function (req, res, next) {
  let _id = req.params.id;
  let { title } = req.body;
  let { content } = req.body;
  let { image } = req.body;
  let typeId = req.body.noteType;
  let { error } = Note.Validate({
    title: title,
    content: content,
    image: image,
    typeId: typeId,
  });
  if (error == null) {
    Type.findOneAndUpdate({ notes: _id }, { $pull: { notes: _id } }).then(
      (type) => {}
    );
    Note.findByIdAndUpdate(_id, {
      title: title,
      content: content,
      image: image,
      type: typeId,
    })
      .then((result) => {
        if (result) {
          Type.findByIdAndUpdate(typeId, { $push: { notes: result._id } })
            .then((result) => {
              if (result) {
                return res.json({
                  error: false,
                  message: "Update note success!",
                  data: [],
                });
              } else {
                return res.json({
                  error: true,
                  message: "There was an error!",
                  data: [],
                });
              }
            })
            .catch((err) => {
              return res.json({ error: true, message: err, data: result });
            });
        }
      })
      .catch((err) => {
        return res.json({
          error: true,
          message: "There was a error!",
          data: [],
        });
      });
  } else {
    return res.json({
      error: true,
      message: error?.details[0]?.message,
      data: [],
    });
  }
};
// Delele Type
exports.deleteNoteById = (req, res, next) => {
  let _id = req.params.id;
  Note.findOneAndRemove({ _id: _id })
    .then((note) => {
      Type.findOneAndUpdate({ notes: _id }, { $pull: { notes: _id } })
        .then((type) => {})
        .catch((err) => {
          console.log(err);
        });

      return res.json({
        error: false,
        message: "Delete Note successfully!",
        data: [],
      });
    })
    .catch((err) => {
      return res.json({
        error: true,
        message: "There was a error!",
        data: [],
      });
    });
};
//#endregion
