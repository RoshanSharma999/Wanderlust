if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const mOver = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local');

const router = express.Router();
const exprsError = require("./utils/exprsError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const user = require("./models/user.js");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mOver("_method"));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

app.use(session({
    secret: 'mysecretstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 3600 * 1000,
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true 
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    return next();
});

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Wanderlust</h1><p>Please go to <a href='http://localhost:8080/listings'>listings<a></p>");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// fun
app.get("/privacy", (req, res) => {
    res.send("<h2>Privacy? Nah, we sold your data to advertisers.</h2>");
});
app.get("/terms", (req, res) => {
    res.send("<h2>We keep changing our temrs</h2>");
});

// 404 - page not found
// app.all("*", (req, res, next) => {
//     throw new exprsError(404, "Page not found");
// });

// error handling
app.use((err, req, res, next) => {
    let {status = 500, message = "Some Unknown Error Occurred!"} = err;
    console.log("Error:", message);
    res.status(status).render("error.ejs", {message});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});
