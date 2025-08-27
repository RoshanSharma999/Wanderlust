const express = require('express');
const router = express.Router({mergeParams: true});
const asyncWrap = require("../utils/warpAsync.js");
const {validateReview} =  require("../utils/validMdlWare");
const {isLoggedIn, isAuthor} = require("../utils/authMdlWare.js");
const reviewController = require("../controllers/review.js");

// adding a review
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.addReview));

// deleting a review
router.delete("/:revId", isLoggedIn, isAuthor, asyncWrap(reviewController.destroyReview)); 

module.exports = router;
