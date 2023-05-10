const session = require("express-session");
const user = require("../models/user");
const Room = require("../models/room");

exports.getTakeNote = (req, res, next) => {
  let baseURL = process.env.BASE_URL;
  return res.render("../views/notetaking.ejs", {
    baseURL: baseURL,
    user: req?.session?.user,
  });
};
exports.getHome = (req, res, next) => {
  if (req?.session?.user) {
    res.render("../views/index.ejs", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
};
exports.getRoom = (req, res, next) => {
  let roomId = req.params.id;
  if (roomId != undefined && roomId != "") {
    Room.findOne({ _id: roomId }).then((result) => {
      if (result) {
        return (
          res.render("collaborateboard.ejs"),
          {
            roomId: roomId,
          }
        );
      }
    });
  }
  return res.redirect("/");
};
exports.postAddRoom = (req, res, next) => {
  let { roomName } = req.body;
  if (roomName && roomName !== undefined) {
    Room.create({ roomname: roomName })
      .then((result) => {
        if (result) {
          res.json({
            error: false,
            message: "Create Room Success!",
            data: result,
            redirectUrl: "room/" + result._id,
          });
        }
      })
      .catch((err) => {
        res.json({
          error: true,
          message: "There was an error!",
          data: [],
        });
      });
  } else {
    res.json({
      error: true,
      message: "Invalid Room Name",
      data: [],
    });
  }
};
exports.getRoomCheck = (req, res, next) => {
  let roomId = req.params.id;
  if (roomId != undefined && roomId != "") {
    Room.findOne({ _id: roomId }).then((result) => {
      if (result) {
        return res.json({
          error: false,
          message: "Connecting To Room...",
          data: "/room/" + roomId,
        });
      }
    });
  }
  return res.json({
    error: true,
    message: "Room not found!",
    data: [],
  });
};
