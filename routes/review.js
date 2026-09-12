const express=require("express");
const router=express.Router({mergeParams:true});
const {validatereview, isLoggedIn, isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


//post req to save comment
router.post("/reviews",isLoggedIn,validatereview,reviewController.reviewAdd); 
//to delete review
router.delete("/review/:reviewid",isLoggedIn,isAuthor,reviewController.reviewDelete);

module.exports=router;