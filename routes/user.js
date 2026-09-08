const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {isLoggedIn}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const reguser=new User({
        email:email,
        username:username
    });
    let newuser=await User.register(reguser,password);
    req.flash("success","Welcome to Travelj❤️");
    res.redirect("/login");
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to travelJ");
    res.redirect("/listing");
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
    });
    req.flash("success","you are logged out");
    res.redirect("/listing");
})
module.exports=router;
