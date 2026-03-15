const ExpressError = require("./utilities/ExpressError.js");
const {campSchema,reviewSchema} = require("./valSchema/Schemas.js");


const CampgroundModel = require("./models/campground.js");
const ReviewModel = require("./models/review.js") ;
module.exports.verifyUser = async (req,res,next)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id) ;
    
    if(camp && ! camp.author.equals(req.user._id)){
        req.flash("error","You are not supposed to edit ") ;
        return res.redirect(`/campgrounds/${id}`) ;
    }
    next() ;
}
module.exports.verifyReviewer = async (req,res,next)=>{
    const {id,reviewId} = req.params ;
    const review = await ReviewModel.findById(reviewId) ;

    
    if(review && ! review.author.equals(req.user._id)){
        req.flash("error","You dont have a permission to do that .! ") ;
        return res.redirect(`/campgrounds/${id}`) ;
    }
    next() ;
}



module.exports.isLoggedIn = (req,res,next) =>{
    if(! req.isAuthenticated()){
        req.session.returnTo  = req.originalUrl ;

        req.flash("error","Try Logging in first") ;
        return res.redirect("/login") ;
    }
    next();
}

module.exports.storeTo =(req,res,next)=>{
    if(req.session.returnTo) 
        res.locals.returnTo = req.session.returnTo ;
    next() ;
}

module.exports.campValidate = (req,res,next)=>{

    const {error} = campSchema.validate(req.body) ;

    if(error){
        const msg = error.details.map(ele => ele.message).join(",") ;
        next(new ExpressError(msg,400)) ;
        
    }
    else next();
}


module.exports.reviewValidate = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(ele => ele.message).join(",")
        next(new ExpressError(msg,400)) ;
    }
    else next() ;
}