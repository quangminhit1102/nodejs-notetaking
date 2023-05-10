const express = require("express");
require("dotenv").config(); // .Env config

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/take-note", homeController.getTakeNote);
router.get("/note-type", noteController.getNoteType);

router.get("/room/:id", homeController.getRoom);
router.get("/room-check/:id", homeController.getRoomCheck);
router.post("/room/add-room", homeController.postAddRoom);

module.exports = router;
