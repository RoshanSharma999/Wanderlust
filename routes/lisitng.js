const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const asyncWrap = require("../utils/warpAsync.js");
const exprsError = require("../utils/exprsError.js");
const { listingSchema } = require("../schema.js");

// function to validate listing using joi
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new exprsError(400, errMsg);
    }
    else return next();
}

// all the listings
router.get("/", asyncWrap(async (req, res) => {
    let allData = await listing.find();
    res.render("listings/home.ejs", { allData });
}));

// to add a new listing
router.get("/new", (req, res) => {
    res.render("listings/addNew.ejs");
});
router.post("/", validateListing, asyncWrap(async (req, res) => {
    let newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show a particular listings
router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id).populate("reviews");
    res.render("listings/showOne.ejs", { thisListing });
}));

// edit a listing
router.get("/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    res.render("listings/edit.ejs", { thisListing });
}));
router.patch("/:id", validateListing, asyncWrap(async (req, res) => {
    if(!req.body.listing) throw new exprsError(400, "Send valid data for listing");
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await listing.findByIdAndUpdate(id, updatedListing, { runValidators: true });
    let thisListing = await listing.findById(id);
    res.render("listings/showOne.ejs", { thisListing });
}));

// delete a listing
router.delete("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
