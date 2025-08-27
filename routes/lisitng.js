const express = require('express');
const router = express.Router();
const listing = require("../models/listing.js");
const asyncWrap = require("../utils/warpAsync.js");
const { isLoggedIn, isOwner } = require("../utils/authMdlWare.js");
const {validateListing} =  require("../utils/validMdlWare");

// all the listings
router.get("/", asyncWrap(async (req, res) => {
    let allData = await listing.find();
    res.render("listings/home.ejs", { allData });
}));

// to add a new listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/addNew.ejs");
});
router.post("/", isLoggedIn, validateListing, asyncWrap(async (req, res) => {
    let reqObj = req.body.listing;
    if(reqObj.image == null || reqObj.image == "") reqObj.image = "/images/default.png";
    let newListing = new listing(reqObj);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// show a particular listings
router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!thisListing){
        req.flash("error", "Listing you requested for doesnt exists!");
        res.redirect("/listings");
    }
    res.render("listings/showOne.ejs", { thisListing });
}));

// edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    if(!thisListing){
        req.flash("error", "Listing you requested for doesnt exists!");
        res.redirect("/listings");
    }
    req.flash("success", "Listing updated!");
    res.render("listings/edit.ejs", { thisListing });
}));
router.patch("/:id", isLoggedIn, isOwner, validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await listing.findByIdAndUpdate(id, updatedListing, { runValidators: true });
    let thisListing = await listing.findById(id);
    res.render("listings/showOne.ejs", { thisListing });
}));

// delete a listing
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;
