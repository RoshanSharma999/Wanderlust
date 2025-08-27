const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.isLoggedIn = function isLoggedIn (req, res, next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in!");
        return res.redirect("/login");
    }
    return next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let thisListing = await listing.findById(id);
    if(!thisListing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have the permission!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}

module.exports.isAuthor = async (req, res, next) => {
    let {id, revId} = req.params;
    console.log(id, revId);
    let thisReview = await review.findById(revId);
    console.log(thisReview);
    if(!thisReview.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have the permission!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}
