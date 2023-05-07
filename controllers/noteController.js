const { json } = require("express");
const Type = require("../models/type"); //Model Type
const Note = require("../models/note"); //Model Note
const User = require("../models/user"); //Model User
const jwt = require("jsonwebtoken");

//#region Type API
// Get All Type
exports.getAllType = (req, res, next) => {
  let user = req?.user;
  Type.find({ user: user._id })
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
// Get All Type by Pagination
//Page
//=>TotalPage
//=>TotalPage
//=>TotalPage
const typeEachPage = 4;
exports.getTypePagination = async (req, res, next) => {
  let user = req?.user;
  let page = 1;
  if (req.query.page != undefined) {
    if (parseInt(req.query.page) != NaN) {
      page = req.query.page > 0 ? req.query.page : 1;
    } else {
      return res.json({ error: true, message: "Page Not Valid", data: result });
    }
  }
  let start = (page - 1) * typeEachPage;
  let total = await Type.find({ user: user._id }).countDocuments();
  var totalPage = Math.ceil(total / typeEachPage);

  let types = await Type.find({ user: user._id })
    .sort({ createdAt: -1 })
    .skip(start)
    .limit(typeEachPage);
  if (types) {
    return res.json({
      error: false,
      message: "Get Data Success!",
      data: {
        totalPage: totalPage,
        currentPage: page,
        data: types,
      },
    });
  } else {
    return res.json({
      error: true,
      message: "There was a error!",
      data: [],
    });
  }
};
// Add Type
exports.postAddType = (req, res, next) => {
  let user = req?.user;
  const title = req.body.title;
  const color = req.body.color;
  const description = req.body.description;
  let { error } = Type.Validate({
    title: title,
    color: color,
    description: description,
    user: user._id,
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
          user: user._id,
        });
        console.log(req.body);
        newType.save().then((result) => {
          if (result.errors) {
            return res.status(200).json(result);
          } else {
            User.findByIdAndUpdate(user._id, {
              $push: { types: newType._id },
            }).then((result) => {
              return res.json({
                error: false,
                message: "Create type successfully!",
                data: newType,
              });
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
  let user = req?.user;
  let _id = req.params.id;
  Type.findOne({ _id: _id, user: user._id })
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
      { title: title, color: color, description: description },
      { new: true }
    ).then((result) => {
      if (result) {
        return res.json({
          error: false,
          message: "Update type successfully!",
          data: result,
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
// exports.deleteTypeById = async (req, res, next) => {
//   let user = req?.user;
//   let _id = req.params.id;
//   Type.deleteOne({ _id: _id, user: user._id }).then((err) => {
//     if (err) {
//       Note.deleteMany({ type: _id }).then((note) => {
//         return res.json({
//           error: false,
//           message: "Delete type successfully!",
//           data: [],
//         });
//       });
//     } else {
//       return res.json({
//         error: true,
//         message: "There was a error!",
//         data: [],
//       });
//     }
//   });
// };
exports.deleteTypeById = async (req, res, next) => {
  let user = req?.user;
  let _id = req.params.id;
  try {
    let deleteType = await Type.findOneAndRemove({ _id: _id, user: user._id });
    if (deleteType == null) {
      return res.json({
        error: true,
        message: "Type not found!",
        data: [],
      });
    }
    let deleteNoteType = await Note.deleteMany({ type: _id });
    let deleteUserType = await User.findOneAndUpdate(user._id, {
      $pull: { types: _id },
    });
    return res.json({
      error: false,
      message: "Delete type successfully!",
      data: [],
    });
  } catch (err) {
    return res.json({
      error: true,
      message: "There was a error!",
      data: err,
    });
  }
};

//#endregion

//#region Note API
// Create new Note
exports.postAddNote = (req, res, next) => {
  let user = req?.user;
  const title = req.body.title;
  const content = req.body.content;
  const image = req.body.image;
  const typeId = req.body.noteType;
  let { error } = Note.Validate({
    title: title,
    content: content,
    image: image,
    typeId: typeId,
    user: user._id,
  });
  if (error == null) {
    let newNote = "";
    Note.create({
      title: title,
      content: content,
      image: image,
      type: typeId,
      user: user._id,
    }).then((result) => {
      newNote = result;
      Type.findByIdAndUpdate(typeId, { $push: { notes: result._id } })
        .then((type) => {
          if (type) {
            User.findByIdAndUpdate(user._id, {
              $push: { notes: result._id },
            }).then((result) => {
              return res.json({
                error: false,
                message: "Create note successfully!",
                data: newNote,
              });
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
  let user = req?.user;
  Note.find({ user: user._id })
    .sort({ createdAt: -1 })
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
exports.patchEditNoteById = async function (req, res, next) {
  let _id = req.params.id;
  let user = req?.user;
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
    let note = await Note.find({ _id: _id, user: user._id });
    if (note != null) {
      let test = note[0];
      console.log(test);
      if (note[0].type != typeId) {
        let type = await Type.findOneAndUpdate(
          { _id: note[0].type },
          { $pull: { notes: _id } }
        );
        let newType = await Type.findOneAndUpdate(
          { _id: typeId },
          { $addToSet: { notes: _id } }
        );
        if (newType == null) {
          return res.json({
            error: true,
            message: "Type not found!",
            data: [],
          });
        }
      }
      note.title = title;
      note.title = title;
      note.content = content;
      note.image = image;
      note.type = typeId;
      let newNote = await Note.findByIdAndUpdate(
        _id,
        {
          title: title,
          content: content,
          image: image,
          type: typeId,
        },
        { new: true }
      );
      if (newNote != null) {
        return res.json({
          error: false,
          message: "Update note success!",
          data: newNote,
        });
      }
    } else {
      return res.json({
        error: true,
        message: "Note not found!",
        data: [],
      });
    }
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
  let user = req?.user;
  Note.findOneAndRemove({ _id: _id })
    .then((note) => {
      Type.findOneAndUpdate({ notes: _id }, { $pull: { notes: _id } })
        .then((type) => {})
        .catch((err) => {
          console.log(err);
        });
      User.findOneAndUpdate({ _id: user._id }, { $pull: { notes: _id } })
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

exports.getNoteType = (req, res, next) => {
  if (req?.session?.user) {
    res.render("../views/notetype.ejs", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
};
