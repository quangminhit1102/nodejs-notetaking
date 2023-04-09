const express = require("express");
require("dotenv").config(); // .Env config

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("../views/index.ejs");
});
router.get("/take-note", (req, res, next) => {
  let baseURL = process.env.BASE_URL;
  res.render("../views/notetaking.ejs", { baseURL: baseURL });
});

module.exports = router;
