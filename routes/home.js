const express = require("express");
require("dotenv").config(); // .Env config

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");
const noteController = require("../controllers/noteController");
const Room = require("../models/room");
const room = require("../models/room");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/take-note", homeController.getTakeNote);
router.get("/note-type", noteController.getNoteType);

router.get("/white-board/room/:id", (req, res, next) => {
  let roomId = req.params.id;
  if (roomId != undefined && roomId != "") {
    Room.find({ _id: roomId }).then((result) => {
      if (result) {
        return res.json({
          error: false,
          message: "Get Room success!",
          data: result,
        });
      }
    });
  } else {
    return res.json({
      error: true,
      message: "Room not Found!",
      data: [],
    });
  }
  res.render("collaborateboard.ejs"),
    {
      roomId: roomId,
    };
});

module.exports = router;
