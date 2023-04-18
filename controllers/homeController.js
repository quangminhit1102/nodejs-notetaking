const session = require("express-session");
const user = require("../models/user");

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
