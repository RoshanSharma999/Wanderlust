const express = require('express');
const passport = require('passport');
const router = express.Router();
const asyncWrap = require("../utils/warpAsync.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post(asyncWrap (userController.signup));

router.route("/login")
.get(userController.loginForm)
.post(passport.authenticate("local",
    {failureRedirect: "/login", failureFlash: true}),
    asyncWrap(userController.login));

router.get("/logout", userController.logout);

module.exports = router;
