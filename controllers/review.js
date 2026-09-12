const ExpressError = require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const list=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");


module.exports.reviewAdd=wrapAsync(async(req,res)=>{
    let listing=await list.findById(req.params.id);
    let newr=new Review(req.body.review);
    newr.Author=req.user._id;
    listing.review.push(newr);

    await newr.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
});

module.exports.reviewDelete=wrapAsync(async(req,res)=>{
    let{id, reviewid}=req.params;
    
    await list.findByIdAndUpdate(id,{$pull:{review: reviewid}});
    await Review.findOneAndDelete({_id: reviewid});

     res.redirect(`/listing/${id}`);
});