const express = require("express");

const authController = require("../controllers/authentication");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("../views/index.ejs");
});
router.get("/take-note", (req, res, next) => {
  res.render("../views/notetaking.ejs");
});

module.exports = router;
