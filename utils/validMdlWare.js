const { listingSchema, reviewSchema } = require("../schema.js");
const exprsError = require("../utils/exprsError.js");

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new exprsError(400, errMsg);
    }
    else return next();
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new exprsError(400, errMsg);
    }
    else return next();
}
