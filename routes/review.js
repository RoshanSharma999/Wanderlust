const express = require('express');
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const asyncWrap = require("../utils/warpAsync.js");
const {validateReview} =  require("../utils/validMdlWare");
const {isLoggedIn, isAuthor} = require("../utils/authMdlWare.js");

// adding a review
router.post("/", isLoggedIn, validateReview, asyncWrap(async (req, res) => {
    let thisListing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    thisListing.reviews.push(newReview);
    await newReview.save();
    await thisListing.save();
    res.redirect(`/listings/${req.params.id}`);
}));

// deleting a review
router.delete("/:revId", isLoggedIn, isAuthor, asyncWrap(async (req, res) => {
    let {id, revId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: revId}});
    await review.findByIdAndDelete(revId);
    res.redirect(`/listings/${req.params.id}`);
})); 

module.exports = router;
