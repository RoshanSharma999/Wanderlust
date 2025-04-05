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
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;