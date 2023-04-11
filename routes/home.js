const express = require("express");
require("dotenv").config(); // .Env config

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/take-note", homeController.getTakeNote);

module.exports = router;
