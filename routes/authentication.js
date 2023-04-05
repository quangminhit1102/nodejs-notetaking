const express = require("express");

const authController = require("../controllers/authentication");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogOut);

router.get("/forgot-password", authController.getForgotPass);

router.post("/forgot-password", authController.postForgotPass);

router.get("/reset-password/:token", authController.getResetPassword);

router.post("/reset-password/:token", authController.postResetPassword);

module.exports = router;