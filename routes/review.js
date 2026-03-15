const express = require("express") ;
const router = express.Router({mergeParams:true}) ;
const wrapAsync = require("../utilities/WrapAsync.js") ;
const CampgroundModel = require("../models/campground.js") ;
const ReviewModel = require("../models/review.js");
const{ reviewValidate ,isLoggedIn,verifyReviewer} = require("../middleware.js") ;




router.post("/",wrapAsync (async (req,res)=>{
    const {id }= req.params;
    const {review} = req.body;
    
    const r1= new ReviewModel(review);
    r1.author = req.user._id ;
    const camp = await CampgroundModel.findById(id);
    r1.campground = camp ;
    await r1.save() ;
    camp.reviews.push(r1);
    await camp.save() ;
    req.flash("success","Review added")
    
    res.redirect(`/campgrounds/${id}`) ;

}))

router.delete("/:reviewId", isLoggedIn,verifyReviewer,wrapAsync(async (req,res)=>{
    const {id,reviewId} = req.params ;
    await CampgroundModel.findByIdAndUpdate(id,{$pull :{reviews :{reviewId}}})
    const review = await ReviewModel.findByIdAndDelete(reviewId) ;
    req.flash("success","Review Deleted ") ;
    res.redirect(`/campgrounds/${id}`);
}) )







module.exports = router ;