const express=require("express");
const router=express.Router({mergeParams:true});
const userController=require("../controllers/user.js");
const {saveUrl}=require("../middleware.js");
const passport=require("passport");

router.get("/signup",userController.signUpPage);

router.post("/signup",userController.signUpAuth);

router.get("/login",userController.loginPage);

router.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),userController.loginAuth);

router.get("/logout",userController.logout);

module.exports=router;
