const list=require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must login first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.saveLink=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listUser=await list.findById(id);
    if(!listUser.owner.equals(res.locals.logpage._id)){
        req.flash("error","you are not the owner of the listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateSchema=(req,res,next)=>{
    let {error}=listSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

module.exports.isAuthor=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    let reviewUser=await Review.findById(reviewid);
    if(!reviewUser.Author.equals(res.locals.logpage._id)){
        req.flash("error","you didn't created the review to delete!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}