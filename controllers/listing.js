const wrapAsync=require("../utils/wrapAsync.js");
const list=require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {listSchema}=require("../schema.js");

module.exports.index=wrapAsync(async (req,res)=>{
    const listingdetails = await list.find({});
    res.render("./listings/home.ejs",{ listingdetails });
});

module.exports.newListingPage=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.newListingCreation=wrapAsync(async (req,res,next)=>{
    let{title:t,description:d,image:i,price:p,location:l,country:c}=req.body.listing;
    const listt=new list(req.body.listing);
    if(!listt.image.url){
        listt.image.url="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9vbCUyMHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D";
    }
    listt.owner=req.user._id;
    await listt.save();
    req.flash("success","new resort is created");
    res.redirect("/listing");
});

module.exports.particularListing=wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const particularlist=await list.findById(id)
    .populate({path :"review",
        populate:{
            path:"Author",},
    })
    .populate("owner");
    if(!particularlist){
        req.flash("error","No resort found");
        res.redirect("/listing");
    }else{
    res.render("./listings/idbased.ejs",{ particularlist });
    }
});

module.exports.listingEditPage=wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const obj=await list.findById(id);
   
    if(!obj){
        req.flash("error","No resort found");
        res.redirect("/listing");
    }else{
    res.render("./listings/edit.ejs",{obj});
    }
});

module.exports.editPost=wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExppressError(400,"Bad request(update data correctly)")
    }
    let{id}=req.params;
    let{title,description,image,price:p,location:l,country:c}=req.body.listing;
    const lisst=await list.findByIdAndUpdate(id, {title:title,description:description,image:image,price:p,location:l,country:c});
    req.flash("success","Update is successful.");
    res.redirect("/listing");
});

module.exports.destroyListing=wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await list.findByIdAndDelete(id);
    req.flash("success","Resort is removed from listing");
    res.redirect("/listing");
});