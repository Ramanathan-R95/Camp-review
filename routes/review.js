const express = require("express") ;
const router = express.Router({mergeParams:true}) ;
const wrapAsync = require("../utilities/WrapAsync.js") ;
const review = require("../controllers/review.js")
const{ reviewValidate ,isLoggedIn,verifyReviewer} = require("../middleware.js") ;




router.post("/",wrapAsync (review.addReview)) ;

router.delete("/:reviewId", isLoggedIn,verifyReviewer,wrapAsync(review.delete) )







module.exports = router ;