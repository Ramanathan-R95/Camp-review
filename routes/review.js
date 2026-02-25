const express = require("express") ;
const router = express.Router({mergeParams:true}) ;
const wrapAsync = require("../utilities/WrapAsync.js") ;
const {reviewSchema } = require("../valSchema/Schemas.js") ;
const CampgroundModel = require("../models/campground.js") ;
const ReviewModel = require("../models/review.js");


const reviewValidate = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(ele => ele.message).join(",")
        next(new ExpressError(msg,400)) ;
    }
    else next() ;
}


router.post("/",reviewValidate,wrapAsync (async (req,res)=>{
    const {id }= req.params;
    const {review} = req.body;
    
    const r1= new ReviewModel(review);
    const camp = await CampgroundModel.findById(id);
    r1.campground = camp ;
    await r1.save() ;
    camp.reviews.push(r1);
    await camp.save() ;
    
    res.redirect(`/campgrounds/${id}`) ;

}))

router.delete("/:reviewId", wrapAsync(async (req,res)=>{
    const {id,reviewId} = req.params ;
    await CampgroundModel.findByIdAndUpdate(id,{$pull :{reviews :{reviewId}}})
    const review = await ReviewModel.findByIdAndDelete(reviewId) ;
    res.redirect(`/campgrounds/${id}`);
}) )







module.exports = router ;