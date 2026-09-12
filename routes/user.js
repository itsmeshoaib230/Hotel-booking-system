const express=require("express");
const router=express.Router({mergeParams:true});
const userController=require("../controllers/user.js");
const {saveUrl}=require("../middleware.js");
const passport=require("passport");

router
    .route("/signup")
    .get(userController.signUpPage)
    .post(userController.signUpAuth);

router
    .route("/login")
    .get(userController.loginPage)
    .post(saveUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),userController.loginAuth);

router.get("/logout",userController.logout);

module.exports=router;
