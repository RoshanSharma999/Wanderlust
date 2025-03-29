const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: String,
    image: {
        type: String,
        default: "/images/default.jpg"
    },
    price: Number,
    location: String,
    country: String,
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;