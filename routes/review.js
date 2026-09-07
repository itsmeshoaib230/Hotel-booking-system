const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const list=require("../models/listing.js");
const {reviewSchema}=require("../schema.js");

const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


//post req to save comment
router.post("/reviews",validatereview,wrapAsync(async(req,res)=>{
    let listing=await list.findById(req.params.id);
    let newr=new Review(req.body.review);

    listing.review.push(newr);

    await newr.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
})); 


//to delete review
router.delete("/review/:reviewid",wrapAsync(async(req,res)=>{
    let{id, reviewid}=req.params;
    await list.findByIdAndUpdate(id,{$pull:{review: reviewid}});
    await Review.findOneAndDelete({_id: reviewid});

     res.redirect(`/listing/${id}`);
}));

module.exports=router;