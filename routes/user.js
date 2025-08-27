const express = require('express');
const passport = require('passport');
const router = express.Router();
const user = require("../models/user.js");
const asyncWrap = require("../utils/warpAsync.js");

// sign in
router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs");
});
router.post("/signup", asyncWrap (async (req, res, next) => {
    try{
        let {email, username, password} = req.body;
        const newUser = new user({email, username});
        await user.register(newUser, password);
        req.login(newUser, (err) => {
            if(err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

// log in
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});
router.post("/login", passport.authenticate("local",
    {failureRedirect: "/login", failureFlash: true}), asyncWrap(async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
}));

// log out
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
