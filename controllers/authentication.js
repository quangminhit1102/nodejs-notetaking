const bcryptjs = require("bcryptjs"); //Encript Password
const User = require("../models/user"); //Model User
const mail = require("../util/sendMail");
const { json } = require("express");
const shortid = require("shortid");
require("dotenv").config(); // .Env config
const jwt = require("jsonwebtoken");
const { Cookie } = require("express-session");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
//Get Sign In
exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error")?.[0];
  let successMessage = req.flash("success")?.[0];
  if (req.session.user) {
    res.redirect("/");
  }
  res.render("../views/authentication/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage,
    successMessage: successMessage,
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
        return res.redirect("/login");
      }
      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // Generate a JWT token
            const token = jwt.sign(
              { id: user._id },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "7d",
              }
            );
            user.token = token;
            user.save().then();
            console.log(token);
            return req.session.save((err) => {
              console.log(err);
              res.cookie("TOKEN", token, {
                maxAge: 604800,
              });
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
    successMessage: "",
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
          req.flash("success", "Sign up success! please log in!");
          return res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// Post Log Out
exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.clearCookie("TOKEN");
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
      userDoc.resetPasswordExpire = new Date(
        new Date().getTime() + 60 * 60 * 24 * 1000
      );
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
// Post Reset Password
exports.postResetPassword = (req, res, next) => {
  let pass = req.body.pass;
  let repass = req.body.repass;
  // let email = req.body.email;

  let token = req.params.token;
  if (pass === repass) {
    User.findOne({ resetPassword: token }).then((userDoc) => {
      let exprireDate = new Date(userDoc.resetPasswordExpire).getTime();
      let dateNow = new Date().getTime();
      if (
        userDoc &&
        userDoc.resetPassword === token &&
        exprireDate >= dateNow
      ) {
        bcryptjs
          .hash(pass, 12)
          .then((hashedPassword) => {
            userDoc.password = hashedPassword;
            userDoc.resetPassword = "";
            userDoc.resetPasswordExpire = "";
            userDoc.save();
          })
          .then((result) => {
            req.flash("success", "Reset password successfully!");
            return res.redirect("/login");
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
