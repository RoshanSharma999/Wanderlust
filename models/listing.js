const mongoose = require('mongoose');
const review = require('./review.js');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: String,
    image: {
        url: String,
        filename: String
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
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

module.exports = mongoose.model("listing", listingSchema);
