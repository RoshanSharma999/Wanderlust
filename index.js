const express = require("express");
const mOver = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const path = require("path");
const listing = require('./models/listing.js');
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

app.get("/", (req, res) => {
    console.log("Reqest on home page");
    res.send("<h1>Welcome to Wanderlust</h1><p>Please go to /listings</p>");
});

// all the listings
app.get("/listings", async (req, res) => {
    console.log("Request on all listings");
    let allData = await listing.find();
    res.render("listings/home.ejs", { allData });
});

// to add a new listing
app.get("/listings/new", (req, res) => {
    console.log("Request to add new listing");
    res.render("listings/addNew.ejs");
});
app.post("/listings", async (req, res) => {
    let newListing = new listing(req.body.listing);
    await newListing.save();
    console.log("New listing saved successfully");
    res.redirect("/listings");
});

// show a particular listings
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    console.log("Request to show [", thisListing.title, "]");
    res.render("listings/showOne.ejs", { thisListing });
});

// edit a listing
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    console.log("Request to edit [", thisListing.title, "]");
    res.render("listings/edit.ejs", { thisListing });
});
app.patch("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await listing.findByIdAndUpdate(id, updatedListing, { runValidators: true });
    console.log("Listing updated successfully");
    let thisListing = await listing.findById(id);
    res.render("listings/showOne.ejs", { thisListing });
});

// delete a listing
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    console.log("Deleted [", thisListing.title, "]");
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


//fun
app.get("/privacy", (req, res) => {
    res.send("<h2>WE GIVE NO PRIVACY TO OUR USERS, WE STEAL ALL UR DATA</h2>");
});
app.get("/terms", (req, res) => {
    res.send("<h2>WE KEEP CHANGING OUR TERMS</h2>");
});
app.get("*", (req, res) => {
    res.send("Error 404 | Page not found");
});