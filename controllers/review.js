const listing = require("../models/listing.js");
const review = require("../models/review.js");

const addReview = async (req, res) => {
    let thisListing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    thisListing.reviews.push(newReview);
    await newReview.save();
    await thisListing.save();
    res.redirect(`/listings/${req.params.id}`);
}

const destroyReview = async (req, res) => {
    let {id, revId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: revId}});
    await review.findByIdAndDelete(revId);
    res.redirect(`/listings/${req.params.id}`);
}

module.exports = {addReview, destroyReview};