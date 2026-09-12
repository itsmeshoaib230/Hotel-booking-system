const express=require("express");
const router=express.Router();
const {isLoggedIn, isOwner, validateSchema}=require("../middleware.js");
const listingController=require("../controllers/listing.js");


//all listing
router.get("/",listingController.index);
//to create new listing page
router.get("/new",isLoggedIn,listingController.newListingPage);

//postreq to create listing
router.post("/new",validateSchema,listingController.newListingCreation);

//a particular listing
router.get("/:id",listingController.particularListing);

//particular listing edit page
router.get("/:id/edit",isLoggedIn,listingController.listingEditPage);

//put req to edit
router.put("/:id/edit",isLoggedIn,isOwner,validateSchema,listingController.editPost);

//to delete listing
router.delete("/:id/delete",isLoggedIn,isOwner,listingController.destroyListing);

module.exports=router;