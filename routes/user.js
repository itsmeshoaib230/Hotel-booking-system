const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {isLoggedIn}=require("../middleware.js");
const {saveUrl}=require("../middleware.js");

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
    req.login(newuser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Travelj❤️");
        res.redirect("/listing");
    })

}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to travelJ");
    let s=res.locals.saveLink || "/listing";
    res.redirect(s);
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
