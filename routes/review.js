const express = require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const asyncWrap = require("../utils/warpAsync.js");
const exprsError = require("../utils/exprsError.js");
const { reviewSchema } = require("../schema.js");

// function to validate review using joi
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new exprsError(400, errMsg);
    }
    else return next();
}

// adding a review
router.post("/", validateReview, asyncWrap(async (req, res) => {
    let thisListing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    thisListing.reviews.push(newReview);
    await newReview.save();
    await thisListing.save();
    res.redirect(`/listings/${req.params.id}`);
}));

// deleting a review
router.delete("/:revId", asyncWrap(async (req, res) => {
    let {id, revId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: revId}});
    await review.findByIdAndDelete(revId);
    res.redirect(`/listings/${req.params.id}`);
})); 

module.exports = router;
