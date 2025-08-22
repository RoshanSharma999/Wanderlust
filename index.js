const express = require("express");
const mOver = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const path = require("path");

const router = express.Router();
const exprsError = require("./utils/exprsError.js");
const listings = require("./routes/lisitng.js");
const reviews = require("./routes/review.js");

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

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Wanderlust</h1><p>Please go to <a href='http://localhost:8080/listings'>listings<a></p>");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// fun
app.get("/privacy", (req, res) => {
    res.send("<h2>Privacy? Nah, we sold your data to advertisers.</h2>");
});
app.get("/terms", (req, res) => {
    res.send("<h2>We keep changing our temrs</h2>");
});

// 404 - page not found
app.all("*", (req, res, next) => {
    throw new exprsError(404, "Page not found");
});

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
