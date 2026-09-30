const express=require("express");
const router=express.Router();
const {isLoggedIn, isOwner, validateSchema}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("../models/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router
    .route("/new")
    .get(isLoggedIn,
        listingController.newListingPage)
    .post(
        isLoggedIn,
        upload.single('listing[image][url]'),
        validateSchema,
        listingController.newListingCreation
      );

router
    .route("/:id/edit")
    .get(isLoggedIn,
        listingController.listingEditPage)
    .put(isLoggedIn,isOwner,
        upload.single('listing[image][url]'),
        validateSchema,
        listingController.editPost);

//all listing
router.get("/",listingController.index);


//a particular listing
router.get("/:id",listingController.particularListing);


//to delete listing
router.delete("/:id/delete",isLoggedIn,isOwner,listingController.destroyListing);

module.exports=router;