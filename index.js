const express = require("express");
const mOver = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const path = require("path");
const listing = require("./models/listing.js");
const asyncWrap = require("./utils/warpAsync.js");
const exprsError = require("./utils/exprsError.js");
const {listingSchema} = require("./schema.js");
const ExprsError = require("./utils/exprsError.js");
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

app.listen(port, () => {
    console.log(`Listening on port 8080`);
    console.log("http://localhost:8080");
});

// function to validate listing using joi
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new ExprsError(400, errMsg);
    }
    else return next();
}

app.get("/", (req, res) => {
    console.log("Reqest on home page");
    res.send("<h1>Welcome to Wanderlust</h1><p>Please go to /listings</p>");
});

// all the listings
app.get("/listings", asyncWrap(async (req, res) => {
    console.log("Request on all listings");
    let allData = await listing.find();
    res.render("listings/home.ejs", { allData });
}));

// to add a new listing
app.get("/listings/new", (req, res) => {
    console.log("Request to add new listing");
    res.render("listings/addNew.ejs");
});
app.post("/listings", validateListing, asyncWrap(async (req, res) => {
    let newListing = new listing(req.body.listing);
    await newListing.save();
    console.log("New listing saved successfully");
    res.redirect("/listings");
}));

// show a particular listings
app.get("/listings/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    console.log("Request to show [", thisListing.title, "]");
    res.render("listings/showOne.ejs", { thisListing });
}));

// edit a listing
app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    console.log("Request to edit [", thisListing.title, "]");
    res.render("listings/edit.ejs", { thisListing });
}));
app.patch("/listings/:id", validateListing, asyncWrap(async (req, res) => {
    if(!req.body.listing) throw new exprsError(400, "Send valid data for listing");
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await listing.findByIdAndUpdate(id, updatedListing, { runValidators: true });
    console.log("Listing updated successfully");
    let thisListing = await listing.findById(id);
    res.render("listings/showOne.ejs", { thisListing });
}));

// delete a listing
app.delete("/listings/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    console.log("Deleted [", thisListing.title, "]");
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//fun
app.get("/privacy", (req, res) => {
    res.send("<h2>Privacy? In this era of Internet? Nah, we sold your data to advertisers.</h2>");
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
