const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");

module.exports.signUpPage=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signUpAuth=wrapAsync(async(req,res)=>{
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
});

module.exports.loginPage=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginAuth=async(req,res)=>{
    req.flash("success","Welcome back to travelJ");
    let s=res.locals.saveLink || "/listing";
    res.redirect(s);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
    });
    req.flash("success","you are logged out");
    res.redirect("/listing");
}