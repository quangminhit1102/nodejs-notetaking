const bcryptjs = require("bcryptjs"); //Encript Password
const User = require("../models/user"); //Model User
const mail = require("../util/sendMail");
const { json } = require("express");
const shortid = require("shortid");
require("dotenv").config(); // .Env config

//Get Sign In
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  if(req.session.user)
  {
    res.redirect("/")
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
//Get SignUp
exports.getForgotPass = (req, res, next) => {
  let errorMessage = req.flash("error")?.[0];
  let successMessage = req.flash("success")?.[0];
  res.render("../views/authentication/forgotpassword", {
    path: "/forgot-password",
    pageTitle: "Authentication",
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
};
// Post Sign Up
exports.postForgotPass = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      let token = shortid.generate();
      userDoc.resetPassword = token;
      userDoc.save();
      // Send Mail
      let html = `<h1>Please Follow this link to Reset Password.</h1><a href="${process.env.BASE_URL}/Reset-Password/${token}">Click Here To Fly.</a>`;
      mail.sendMail(email, "Forgot Password", html).then((error, info) => {
        console.log(res);
        if (error) {
          req.flash("success", "Sent Mail to Reset Password!");
          return res.redirect("/forgot-password");
        } else {
          req.flash("error", "There was an Error!");
          return res.redirect("/forgot-password");
        }
      });
    } else {
      req.flash("error", "Email doesn't exist!");
      return res.redirect("/forgot-password");
    }
  });
};
// Reset Password
exports.getResetPassword = (req, res, next) => {
  let errorMessage = req.flash("error")?.[0];
  let successMessage = req.flash("success")?.[0];
  res.render("../views/authentication/resetpassword", {
    path: `/reset-password/${req.params.token}`,
    pageTitle: "Authentication",
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
};
exports.postResetPassword = (req, res, next) => {
  let pass = req.body.pass;
  let repass = req.body.repass;
  let email = req.body.email;

  let token = req.params.token;
  if (pass === repass) {
    User.findOne({ email: email }).then((userDoc) => {
      if (userDoc && userDoc.resetPassword === token) {
        return bcryptjs
          .hash(pass, 12)
          .then((hashedPassword) => {
            userDoc.email = email;
            userDoc.password = hashedPassword;
            userDoc.token = "";
            return userDoc.save();
          })
          .then((result) => {
            res.redirect("/login");
          });
      } else {
        req.flash("error", "There was an error!");
        return res.redirect(`/reset-password/${req.params.token}`);
      }
    });
  } else {
    req.flash("error", "Password doesn't match!");
    return res.redirect(`/reset-password/${req.params.token}`);
  }
};
