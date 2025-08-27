const express = require('express');
const router = express.Router();
const asyncWrap = require("../utils/warpAsync.js");
const { isLoggedIn, isOwner } = require("../utils/authMdlWare.js");
const {validateListing} =  require("../utils/validMdlWare.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// all the listings
router.get("/", asyncWrap(listingController.allListings));

// to add a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, upload.single("listing[image]"),
    validateListing, asyncWrap(listingController.addNew));

// show a particular listings
router.get("/:id", asyncWrap(listingController.showOne));

// edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.renderEditForm));
router.patch("/:id", isLoggedIn, isOwner, upload.single("newImage"),
    validateListing, asyncWrap(listingController.updateEdited));

// delete a listing
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));

module.exports = router;
