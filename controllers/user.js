const user = require("../models/user.js");

const signupForm = (req, res) => {
    res.render("auth/signup.ejs");
}

const signup = async (req, res, next) => {
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
}

const loginForm = (req, res) => {
    res.render("auth/login.ejs");
}

const login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}

module.exports = {signupForm, signup, loginForm, login, logout};
