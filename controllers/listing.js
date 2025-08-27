const listing = require("../models/listing.js");
const {cloudinary} = require("../cloudConfig.js");

const allListings = async (req, res) => {
    let allData = await listing.find();
    res.render("listings/home.ejs", { allData });
}

const renderNewForm = (req, res) => {
    res.render("listings/addNew.ejs");
}
const addNew = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}

const showOne = async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!thisListing){
        req.flash("error", "Listing you requested for doesnt exists!");
        res.redirect("/listings");
    }
    res.render("listings/showOne.ejs", { thisListing });
}

const renderEditForm = async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    if(!thisListing){
        req.flash("error", "Listing you requested for doesnt exists!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { thisListing });
}
const updateEdited = async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    let listingDoc = await listing.findByIdAndUpdate(id, updatedListing, { new: true, runValidators: true });
    if (req.file) {
        if (listingDoc.image && listingDoc.image.filename) {
            await cloudinary.uploader.destroy(listingDoc.image.filename);
        }
        listingDoc.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listingDoc.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listingDoc._id}`);
}

const destroyListing = async (req, res) => {
    let { id } = req.params;
    let thisListing = await listing.findById(id);
    if (thisListing.image && thisListing.image.filename) {
        await cloudinary.uploader.destroy(thisListing.image.filename);
    }
    await listing.findByIdAndDelete(id);
    req.flash("success", "Deleted the listing!");
    res.redirect("/listings");
}

module.exports = {allListings, renderNewForm, addNew, showOne, renderEditForm, updateEdited, destroyListing};
