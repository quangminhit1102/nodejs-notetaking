const bcryptjs = require("bcryptjs"); //Encript Password
const User = require("../models/user"); //Model User

//Get Sign In
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("../views/authentication/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};
// Post Login
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.pass;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("../views/authentication/login");
      }
      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

//Get SignUp
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("../views/authentication/register", {
    path: "/register",
    pageTitle: "Signup",
    errorMessage: message,
  });
};
// Post Sign Up
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.pass;
  const confirmPassword = req.body.repass;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one."
        );
        return res.redirect("/signup");
      } else {
        if (password !== confirmPassword) {
          req.flash("error", "Password does not match!");
          return res.redirect("/signup");
        }
      }

      return bcryptjs
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// Post Log Out
exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
